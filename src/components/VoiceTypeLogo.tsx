const VoiceTypeLogo = () => {
  return (
    <div className="flex flex-col items-center mb-10 select-none">
      <div className="relative mb-4 group cursor-pointer transition-transform hover:scale-105 duration-300">
        <svg
          width="80"
          height="80"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-blue-600 drop-shadow-md"
        >
          {/* Outer Ring */}
          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" className="opacity-10 group-hover:opacity-20 transition-opacity" />
          
          {/* Sound Wave Bars */}
          <path
            d="M50 25V75"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_1.5s_ease-in-out_infinite]"
          />
          <path
            d="M35 35V65"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_1.5s_ease-in-out_0.2s_infinite]"
          />
          <path
            d="M65 35V65"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_1.5s_ease-in-out_0.2s_infinite]"
          />
           <path
            d="M20 45V55"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_1.5s_ease-in-out_0.4s_infinite]"
          />
          <path
            d="M80 45V55"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-[pulse_1.5s_ease-in-out_0.4s_infinite]"
          />
        </svg>
      </div>
      <h1 className="text-5xl font-bold text-gray-800 tracking-tight font-sans">
        Voice <span className="text-blue-600">Type</span>
      </h1>
    </div>
  );
};

export default VoiceTypeLogo;
