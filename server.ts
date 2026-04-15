
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import { createServer as createViteServer } from 'vite';
import { UserModel, CourseModel, EnrollmentModel, CertificateModel, PageContentModel } from './models';
import { UserRole } from './types';

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.resolve();

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/deeni-madrasa';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
app.get('/api/content/:pageId', async (req, res) => {
  try {
    const content = await PageContentModel.findOne({ pageId: req.params.pageId });
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch page content' });
  }
});

app.put('/api/content/:pageId', async (req, res) => {
  try {
    const content = await PageContentModel.findOneAndUpdate(
      { pageId: req.params.pageId },
      { content: req.body.content },
      { new: true, upsert: true }
    );
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update page content' });
  }
});
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/api/users/:firebaseUid', async (req, res) => {
  try {
    const user = await UserModel.findOne({ firebaseUid: req.params.firebaseUid });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/users/sync', async (req, res) => {
  try {
    const { firebaseUid, email, name, avatar, role, ...rest } = req.body;
    let user = await UserModel.findOne({ firebaseUid });
    
    if (!user) {
      // Check if user with same email exists (maybe from seed or manual entry)
      user = await UserModel.findOne({ email });
      if (user) {
        // Link existing user to firebaseUid
        user.firebaseUid = firebaseUid;
        if (name) user.name = name;
        if (avatar) user.avatar = avatar;
        // Update with rest of the fields
        Object.assign(user, rest);
        await user.save();
      } else {
        // Create new user
        user = new UserModel({
          firebaseUid,
          email,
          name,
          avatar: avatar || `https://i.pravatar.cc/150?u=${firebaseUid}`,
          role: role || UserRole.STUDENT,
          ...rest
        });
        await user.save();
      }
    } else {
      // Update existing user with rest of the fields if they are provided
      Object.assign(user, rest);
      await user.save();
    }
    
    res.json(user);
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

app.put('/api/users/:firebaseUid', async (req, res) => {
  try {
    const user = await UserModel.findOneAndUpdate(
      { firebaseUid: req.params.firebaseUid },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const courses = await CourseModel.find();
    // Ensure all courses have slugs (migration for existing data)
    const coursesWithSlugs = await Promise.all(courses.map(async (course) => {
      if (!course.slug) {
        course.slug = generateSlug(course.title);
        await course.save();
      }
      return course;
    }));
    res.json(coursesWithSlugs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const slug = generateSlug(req.body.title);
    const course = new CourseModel({ ...req.body, slug });
    await course.save();
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.title) {
      updateData.slug = generateSlug(updateData.title);
    }
    const course = await CourseModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    await CourseModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

app.get('/api/enrollments', async (req, res) => {
  try {
    const enrollments = await EnrollmentModel.find();
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enrollments' });
  }
});

app.post('/api/enrollments', async (req, res) => {
  try {
    const enrollment = new EnrollmentModel(req.body);
    await enrollment.save();
    
    // Update course enrolled count
    await CourseModel.findByIdAndUpdate(req.body.courseId, { $inc: { enrolledCount: 1 } });
    
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to enroll' });
  }
});

app.post('/api/enrollments/:id/complete-lesson', async (req, res) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await EnrollmentModel.findById(req.params.id);
    if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });

    if (!enrollment.completedLessonIds.includes(lessonId)) {
      enrollment.completedLessonIds.push(lessonId);
      
      // Update progress
      const course = await CourseModel.findById(enrollment.courseId);
      if (course && course.lessons.length > 0) {
        enrollment.progress = Math.round((enrollment.completedLessonIds.length / course.lessons.length) * 100);
        if (enrollment.progress === 100) {
          enrollment.completed = true;
        }
      }
      
      await enrollment.save();
    }
    
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to complete lesson' });
  }
});

// Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { courseId, studentId, studentEmail } = req.body;
    const course = await CourseModel.findById(courseId);
    
    if (!course) return res.status(404).json({ error: 'Course not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
              images: [course.thumbnail],
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?payment=success&courseId=${courseId}`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?payment=cancel`,
      customer_email: studentEmail,
      metadata: {
        courseId: courseId.toString(),
        studentId: studentId.toString(),
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

app.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.APP_URL || 'https://deenimadrasa.com';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const courses = await CourseModel.find();
    const baseUrl = process.env.APP_URL || 'https://deenimadrasa.com';
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/courses</loc>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/pricing</loc>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <priority>0.6</priority>
  </url>`;

    courses.forEach(course => {
      sitemap += `
  <url>
    <loc>${baseUrl}/course/${course.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    sitemap += '\n</urlset>';
    
    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (err) {
    res.status(500).send('Error generating sitemap');
  }
});

// Webhook for Stripe
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { courseId, studentId } = session.metadata || {};

    if (courseId && studentId) {
      // Create enrollment
      const enrollment = new EnrollmentModel({
        courseId,
        studentId,
        progress: 0,
        completedLessonIds: [],
        completed: false,
        enrollmentDate: new Date()
      });
      await enrollment.save();
      
      // Update course enrolled count
      await CourseModel.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });
    }
  }

  res.json({ received: true });
});

app.get('/api/stats', async (req, res) => {
  try {
    const totalStudents = await UserModel.countDocuments({ role: UserRole.STUDENT });
    const totalTeachers = await UserModel.countDocuments({ role: UserRole.TEACHER });
    const activeCourses = await CourseModel.countDocuments();
    const courses = await CourseModel.find();
    const totalRevenue = courses.reduce((acc, c) => acc + (c.price * c.enrolledCount), 0);

    res.json({
      totalStudents,
      totalTeachers,
      activeCourses,
      totalRevenue
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Certificate Routes
app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await CertificateModel.find();
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

app.get('/api/certificates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Try finding by Certificate ID first
    let certificate = await CertificateModel.findById(id).catch(() => null);
    
    // If not found, try finding by studentId (return the latest one if multiple)
    if (!certificate) {
      certificate = await CertificateModel.findOne({ studentId: id }).sort({ issueDate: -1 });
    }

    if (!certificate) return res.status(404).json({ error: 'Certificate not found' });
    res.json(certificate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify certificate' });
  }
});

app.post('/api/certificates', async (req, res) => {
  try {
    const { enrollmentId, studentId, studentName, courseId, courseTitle, teacherName } = req.body;
    
    // Check if already exists
    const existing = await CertificateModel.findOne({ enrollmentId });
    if (existing) return res.status(400).json({ error: 'Certificate already exists for this enrollment' });

    const certificate = new CertificateModel({
      enrollmentId,
      studentId,
      studentName,
      courseId,
      courseTitle,
      teacherName,
      verificationUrl: `${process.env.APP_URL || 'http://localhost:3000'}/verify-certificate/`
    });

    await certificate.save();
    
    // Update enrollment with certificate ID
    await EnrollmentModel.findByIdAndUpdate(enrollmentId, { certificateId: certificate._id });

    res.status(201).json(certificate);
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
});

app.get('/api/users/:id/certificates', async (req, res) => {
  try {
    const certificates = await CertificateModel.find({ studentId: req.params.id });
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user certificates' });
  }
});

// Seed Route (for demo purposes)
app.post('/api/seed', async (req, res) => {
  try {
    await UserModel.deleteMany({});
    await CourseModel.deleteMany({});
    await EnrollmentModel.deleteMany({});

    const { MOCK_USERS, MOCK_COURSES } = await import('./constants');
    
    // Insert Users
    const users = await UserModel.insertMany(MOCK_USERS.map(({ id, ...rest }) => rest));
    
    // Map old IDs to new MongoDB IDs
    const teacherMap: Record<string, string> = {};
    users.forEach((u, i) => {
      if (u.role === UserRole.TEACHER) {
        teacherMap[MOCK_USERS[i].id] = u._id.toString();
      }
    });

    // Insert Courses
    const coursesToInsert = MOCK_COURSES.map(({ id, teacherId, ...rest }) => ({
      ...rest,
      slug: generateSlug(rest.title),
      teacherId: teacherMap[teacherId] || users[0]._id
    }));
    await CourseModel.insertMany(coursesToInsert);

    res.json({ message: 'Database seeded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to seed database' });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
  }

  app.listen(PORT as any, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
