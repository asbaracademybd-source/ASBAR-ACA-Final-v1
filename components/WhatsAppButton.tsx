import React from 'react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = "+8801580926103";
  const message =
    "Assalamu Alaikum, I would like to know more about Asbar Academy.";

  const whatsappUrl = `https://wa.me/${phoneNumber.replace(
    /[^0-9]/g,
    ''
  )}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Tooltip */}
      <div className="absolute right-16 bottom-1/2 translate-y-1/2 bg-black text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 whitespace-nowrap shadow-lg">
        Chat with us
      </div>

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse animation */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>

        {/* Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          className="w-7 h-7 z-10"
        >
          <path
            fill="white"
            d="M24.052 19.668c-.39-.195-2.308-1.139-2.666-1.27-.358-.13-.619-.195-.879.195s-1.008 1.27-1.235 1.53c-.227.26-.455.293-.845.098-.39-.195-1.646-.607-3.136-1.937-1.158-1.033-1.94-2.308-2.167-2.698-.227-.39-.024-.6.171-.794.176-.175.39-.455.585-.683.195-.227.26-.39.39-.65.13-.26.065-.488-.032-.683-.098-.195-.879-2.12-1.204-2.902-.317-.762-.64-.658-.879-.67l-.75-.013c-.26 0-.683.098-1.04.488s-1.367 1.336-1.367 3.258c0 1.922 1.399 3.778 1.594 4.038.195.26 2.756 4.207 6.683 5.897.935.403 1.664.643 2.233.823.938.298 1.793.256 2.468.155.753-.112 2.308-.943 2.633-1.855.325-.911.325-1.693.227-1.855-.098-.163-.358-.26-.748-.455z"
          />
        </svg>
      </a>
    </div>
  );
};

export default WhatsAppButton;