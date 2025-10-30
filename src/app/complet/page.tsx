"use client";

import React, { useEffect, useState, useRef  } from "react";
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
  const [width, setWidth] = useState(1920);
  const [krathongs, setKrathongs] = useState<KrathongInfo[]>([]);
  const [displayKrathongs, setDisplayKrathongs] = useState<KrathongInfo[]>([]);
  const [batchIndex] = useState(0);
  const hoverRef = useRef<number | null>(null);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWidth(window.innerWidth);
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

    if (krathongs.length <= 6) {
      setDisplayKrathongs(krathongs);
    } else {
      const start = batchIndex * 6;
      const end = start + 6;
      setDisplayKrathongs(krathongs.slice(start, end));
    }
  }, [krathongs, batchIndex]);
  const getRandomProps = (waveOptions: number[]) => {
    const waveY = waveOptions[Math.floor(Math.random() * waveOptions.length)];
    const dur = (15 + Math.random() * 15).toFixed(0);
    return { waveY, dur };
  };

  const waveLayers = [15, 75, 158];
  useEffect(() => {
    setShowPopup(true);
  }, []);

  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsTablet(width >= 1180 && width <= 1366);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <video
        src={isMobile ? "/videos/background6.mp4" : "/videos/background5.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-fill z-0"
      />
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
              <div className="relative w-[300px] h-[140px]"> {/* ปรับขนาดตรงนี้ได้ */}
                <Image
                  src="/success-star.png"
                  alt="success"
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={() => setShowPopup(false)}
                className="absolute top-2 right-0 bg-white/0 rounded-full p-2 text-2xl font-bold text-black transition"
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
            <Image
              src="/success-star.png"
              alt="success"
              width={500}
              height={350}
            />

            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-0 right-1 bg-white/0 rounded-full p-3 text-2xl font-bold text-black transition"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>)
      }
      {isMobile ? (
        <div className="fixed top-[28%] left-[50%] p-1 z-40 -translate-x-1/2">
          <h1
            className="text-4xl text-[#ffda4d] text-center font-extrabold font-[prompt]"
            style={{
              WebkitTextStroke: "2px #5e17eb",
              WebkitTextFillColor: "#ffda4d",
            }}
          >
            {krathongs.length.toString().padStart(3, "0")}
          </h1>
        </div>
      ) : (
        <div className="absolute top-[38%] left-[38.7%] p-1 z-40">
          <div className="flex items-center justify-center gap-2 font-[prompt]">
            <h1 className={`text-[#4a4649] ${isTablet ? "text-2xl" : "text-3xl"}`}>จำนวนกระทง</h1>
            <h1 className={`text-[#4a4649] ${isTablet ? "text-2xl" : "text-3xl"}`}>
              {krathongs.length.toString().padStart(3, "0")}
            </h1>
            <h2 className={`text-[#4a4649] ${isTablet ? "text-2xl" : "text-3xl"}`}>กระทง</h2>
          </div>
        </div>
      )}
      <div className="absolute bottom-0 w-full flex flex-col items-center justify-end gap-y-10 h-[500px] overflow-visible">
        {displayKrathongs.map((k, layerIdx) => {
          const { waveY, dur } = getRandomProps(waveLayers);

          return (
            <svg
              key={`wave-${k.idx}-${layerIdx}`}
              viewBox={`0 0 ${width} 230`}
              className="absolute w-full h-[500px] top-16 left-0"
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
                  x="-50"
                  y="-50"
                  width="100"
                  height="100"
                  opacity="1"
                />
                {(() => {
                  const padding = 10;
                  const nameLength = k.showName.length * 8.5;
                  const wishLength = k.wish.length * 7;
                  const boxWidth = Math.max(nameLength, wishLength) + padding * 2;
                  const boxHeight = 50;
                  return (
                    <>
                      <rect
                        x={-boxWidth / 2}
                        y="-95"
                        width={boxWidth}
                        height={boxHeight}
                        rx="8"
                        fill="rgba(254, 255, 254, 0.7)"
                      />
                      <text
                        x="0"
                        y="-75"
                        textAnchor="middle"
                        fontFamily="Prompt"
                        fontSize="14"
                        fill="#333"
                        fontWeight="bold"
                      >
                        {k.showName}
                      </text>
                      <text
                        x="0"
                        y="-58"
                        textAnchor="middle"
                        fontFamily="Prompt"
                        fontSize="12"
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
        className="absolute bottom-5 z-20 font-[Prompt] font-bold text-[#4557c7] text-[23px] px-10 py-2 bg-white rounded-[50px] shadow-[0_0_25px_10px_rgba(255,255,255,0.6)] transition-shadow duration-300"
      >
        ลอยกระทง
      </Link>
    </div>
  );
}
