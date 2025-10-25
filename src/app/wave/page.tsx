"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(1920);

  useEffect(() => {
    // ให้รันใน browser เท่านั้น
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <video
        src={isMobile ? "/videos/background2.mp4" : "/videos/background1.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-80"
      />
      <div className="relative w-full h-[250px] mt-[265px] flex items-center justify-center overflow-visible">
        <svg
          viewBox={`0 0 ${width} 200`}
          className="absolute w-full h-[200px] top-0 left-0"
        >

          <motion.path
            d={`
              M0 115
              Q ${width * 0.04} 105, 
                ${width * 0.070} 135
              T ${width * 0.130} 120
              T ${width * 0.200} 120
              T ${width * 0.270} 120
              T ${width * 0.340} 120
              T ${width * 0.415} 120
              T ${width * 0.490} 120
              T ${width * 0.560} 120
              T ${width * 0.628} 120
              T ${width * 0.695} 120
              T ${width * 0.765} 120
              T ${width * 0.84} 120
              T ${width * 0.910} 120
              T ${width * 0.985} 120
              T ${width} 110
            `}
            fill="transparent"
            stroke="#FF69B4"
            strokeWidth="5"
            strokeOpacity="0.6"
          />
          <motion.circle r="10" fill="#FF69B4">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              path={`
              M0 115
              Q ${width * 0.04} 105, 
                ${width * 0.070} 135
              T ${width * 0.130} 120
              T ${width * 0.200} 120
              T ${width * 0.270} 120
              T ${width * 0.340} 120
              T ${width * 0.415} 120
              T ${width * 0.490} 120
              T ${width * 0.560} 120
              T ${width * 0.628} 120
              T ${width * 0.695} 120
              T ${width * 0.765} 120
              T ${width * 0.84} 120
              T ${width * 0.910} 120
              T ${width} 115
              `}
            />
          </motion.circle>
        </svg>
      </div>
      <div className="relative z-20 items-center gap-6 text-center">
        <Link
          href="/Create_Krathong"
          className="text-2xl font-semibold text-white bg-pink-500 px-8 py-4 rounded-2xl shadow-lg hover:bg-pink-600 transition-all"
        >
          Create Krathong
        </Link>
      </div>
    </div>
  );
}