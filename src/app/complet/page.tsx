"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface KrathongInfo {
  idx: number;
  showName: string;
  wish: string;
  image_path: string;
  created_at: string;
}

export default function Complet() {
  const [showPopup, setShowPopup] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [width, setWidth] = useState(1920);
  const [krathongs, setKrathongs] = useState<KrathongInfo[]>([]);
  const [displayKrathongs, setDisplayKrathongs] = useState<KrathongInfo[]>([]);
  const [batchIndex] = useState(0);
  const hoverRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 430);
      setIsTablet(windowWidth >= 768 && windowWidth < 1400);
      setWidth(windowWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchKrathongs = async () => {
      const { data, error } = await supabase
        .from("information")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) console.log("Error fetching krathongs:", error);
      else setKrathongs(data as KrathongInfo[]);
    };
    fetchKrathongs();
  }, []);

  useEffect(() => {
    if (krathongs.length === 0) return;

    const maxDisplay = isMobile ? 4 : isTablet ? 5 : 6;

    if (krathongs.length <= maxDisplay) {
      setDisplayKrathongs(krathongs);
    } else {
      const start = batchIndex * maxDisplay;
      const end = start + maxDisplay;
      setDisplayKrathongs(krathongs.slice(start, end));
    }
  }, [krathongs, batchIndex, isMobile, isTablet]);

  const getRandomProps = (waveOptions: number[]) => {
    const waveY = waveOptions[Math.floor(Math.random() * waveOptions.length)];
    const dur = (15 + Math.random() * 15).toFixed(0);
    return { waveY, dur };
  };

  const waveLayers = isMobile ? [20, 60, 120] : isTablet ? [18, 70, 140] : [15, 75, 158];

  useEffect(() => {
    setShowPopup(true);
  }, []);

  // ขนาดกระทงตามหน้าจอ
  const krathongSize = isMobile ? 70 : isTablet ? 85 : 100;
  const fontSize = {
    name: isMobile ? 12 : isTablet ? 13 : 14,
    wish: isMobile ? 10 : isTablet ? 11 : 12,
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <video
        src={isMobile ? "/videos/background6_1.mp4" : "/videos/background5.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
      />

      {/* Popup Success */}
      {isMobile ? (
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4 }}
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative w-[300px] h-[120px] sm:w-[300px] sm:h-[140px]">
                <Image
                  src="/success-star.png"
                  alt="success"
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-0 right-1 bg-white/0 rounded-full p-2 
                           text-xl sm:text-2xl font-bold text-black 
                           hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.4 }}
              className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative w-[400px] h-[280px] lg:w-[500px] lg:h-[350px]">
                <Image
                  src="/success-star.png"
                  alt="success"
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="fixed top-18 right-2 bg-white/0 rounded-full p-3 
                           text-2xl font-bold text-black 
                           hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* แสดงจำนวนกระทง */}
      {isMobile ? (
        <div className="fixed  left-[50%] p-1 z-40 -translate-x-1/2 -top-[20%]">
          <div className="flex items-center justify-center w-screen h-screen ">
            <div className="relative">
              <svg
                width="265"
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
                  rx="150"
                  fill="white"
                  fillOpacity="0.7"
                  stroke="url(#paint0_linear_362_447)"
                  strokeWidth="30"
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
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-[63%] pt-5 z-40 flex flex-col items-center gap-3">
                <h1 className="text-[19.151px] text-[#4557c7] font-bold font-[prompt]">
                  อัปเดตจำนวนกระทงล่าสุด
                </h1>
                <h1
                  className="text-2xl text-[#ffda4d] text-center font-extrabold font-[prompt]"
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
      ) : isTablet ? (
        <div className="fixed top-[38%] left-[38.3%] p-1 z-40">
          <div className="flex items-center justify-center gap-2 font-[prompt]">
            <h1 className="text-2xl text-[#4a4649]">จำนวนกระทง</h1>
            <h1 className="text-2xl text-[#4a4649]">
              {krathongs.length.toString().padStart(3, "0")}
            </h1>
            <h2 className="text-2xl text-[#4a4649]">กระทง</h2>
          </div>
        </div>
      ) : (
        <div className="fixed top-[38%] left-[38.7%] p-1 z-40">
          <div className="flex items-center justify-center gap-2 font-[prompt]">
            <h1 className="text-3xl text-[#4a4649]">จำนวนกระทง</h1>
            <h1 className="text-3xl text-[#4a4649]">
              {krathongs.length.toString().padStart(3, "0")}
            </h1>
            <h2 className="text-3xl text-[#4a4649]">กระทง</h2>
          </div>
        </div>
      )}

      {/* กระทงลอยน้ำ */}
      <div className="fixed bottom-0 w-full flex flex-col items-center justify-end gap-y-10 h-[400px] sm:h-[450px] lg:h-[500px] overflow-visible">
        {displayKrathongs.map((k, layerIdx) => {
          const { waveY, dur } = getRandomProps(waveLayers);

          return (
            <svg
              key={`wave-${k.idx}-${layerIdx}`}
              viewBox={`0 0 ${width} 230`}
              className="absolute w-full h-[400px] sm:h-[450px] lg:h-[500px] top-16 left-0"
            >
              <g
                style={{ cursor: "pointer" }}
                onMouseEnter={() => (hoverRef.current = k.idx)}
                onMouseLeave={() => (hoverRef.current = null)}
              >
                <animateMotion
                  dur={`${dur}s`}
                  repeatCount="indefinite"
                  begin={`0.08s`}
                  path={`M-500 ${waveY}
                    Q ${width * 0.05} ${waveY - 10}, ${width * 0.1} ${waveY + 15}
                    T ${width * 0.2} ${waveY}
                    T ${width * 0.3} ${waveY + 5}
                    T ${width * 0.4} ${waveY}
                    T ${width * 0.5} ${waveY + 10}
                    T ${width * 0.6} ${waveY}
                    T ${width * 0.7} ${waveY + 5}
                    T ${width * 0.8} ${waveY}
                    T ${width * 0.9} ${waveY + 5}
                    T ${width} ${waveY}`}
                />
                <image
                  href={k.image_path}
                  x={-krathongSize / 2}
                  y={-krathongSize / 2}
                  width={krathongSize}
                  height={krathongSize}
                  opacity="1"
                />
                {(() => {
                  const padding = isMobile ? 8 : 10;
                  const charWidth = isMobile ? 7 : 8.5;
                  const nameLength = k.showName.length * charWidth;
                  const wishLength = k.wish.length * (charWidth - 1.5);
                  const boxWidth = Math.max(nameLength, wishLength) + padding * 2;
                  const boxHeight = isMobile ? 44 : isTablet ? 47 : 50;
                  const boxY = isMobile ? -85 : isTablet ? -90 : -95;
                  
                  return (
                    <>
                      <rect
                        x={-boxWidth / 2}
                        y={boxY}
                        width={boxWidth}
                        height={boxHeight}
                        rx="8"
                        fill="rgba(254, 255, 254, 0.7)"
                      />
                      <text
                        x="0"
                        y={boxY + 20}
                        textAnchor="middle"
                        fontFamily="Prompt"
                        fontSize={fontSize.name}
                        fill="#333"
                        fontWeight="bold"
                      >
                        {k.showName}
                      </text>
                      <text
                        x="0"
                        y={boxY + 37}
                        textAnchor="middle"
                        fontFamily="Prompt"
                        fontSize={fontSize.wish}
                        fill="#555"
                      >
                        {k.wish}
                      </text>
                    </>
                  );
                })()}
              </g>
            </svg>
          );
        })}
      </div>

      {/* ปุ่มลอยกระทง */}
      <Link
        href="/Create_Krathong"
        className="fixed bottom-5 z-20 font-[Prompt] font-bold text-[#4557c7] 
                   text-lg sm:text-xl lg:text-[23px] 
                   px-6 sm:px-8 lg:px-10 
                   py-2 bg-white rounded-[50px] 
                   shadow-[0_0_25px_10px_rgba(255,255,255,0.6)] 
                   hover:shadow-[0_0_30px_15px_rgba(255,255,255,0.8)]
                   transition-shadow duration-300"
      >
        ลอยกระทง
      </Link>
    </div>
  );
}