"use client";

export default function GradientBox({ krathongs = [] }) {
  return (
            <div className="fixed -translate-y-8/2 left-[50%] p-1 z-40 -translate-x-1/2">
          <div className="flex items-center justify-center w-screen h-screen bg-black">
      <div className="relative">
        <svg
          width="250"
          height="150"
          viewBox="0 0 1583 616"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-xl"
        >
          <rect
            x="23"
            y="23"
            width="1537"
            height="570"
            rx="38"
            fill="white"
            fillOpacity="0.8"
            stroke="url(#paint0_linear_362_447)"
            strokeWidth="46"
          />
          <defs>
            <linearGradient
              id="paint0_linear_362_447"
              x1="791.5"
              y1="0"
              x2="791.5"
              y2="616"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#6131BF" />
              <stop offset="0.5" stopColor="#B07BCE" />
              <stop offset="1" stopColor="#81CEFF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* ข้อความตรงกลาง */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 z-40">
          <h1
            className="text-xl sm:text-2xl text-[#ffda4d] text-center font-extrabold font-[prompt]"
            style={{
              WebkitTextStroke: "1px #5e17eb",
              WebkitTextFillColor: "#ffda4d",
            }}
          >
            {krathongs.length.toString().padStart(3, "0")}
          </h1>
        </div>
      </div>
    </div>
        </div>
  );
}
