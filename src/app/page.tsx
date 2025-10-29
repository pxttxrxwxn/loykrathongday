"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

interface KrathongInfo {
  idx: number;
  showName: string;
  wish: string;
  image_path: string;
  created_at: string;
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(1920);
  const [krathongs, setKrathongs] = useState<KrathongInfo[]>([]);
  const [displayKrathongs, setDisplayKrathongs] = useState<KrathongInfo[]>([]);
  const [batchIndex] = useState(0);
  const hoverRef = useRef<number | null>(null);

  // ตรวจขนาดหน้าจอ
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ดึงข้อมูลจาก Supabase
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

  // จัดชุดกระทง (batch ละ 10)
  useEffect(() => {
    if (krathongs.length === 0) return;

    if (krathongs.length <= 6) {
      // ถ้าน้อยกว่าหรือเท่ากับ 10 → แสดงทั้งหมด
      setDisplayKrathongs(krathongs);
    } else {
      // ถ้ามากกว่า 10 → แสดงเฉพาะ batch ปัจจุบัน
      const start = batchIndex * 6;
      const end = start + 6;
      setDisplayKrathongs(krathongs.slice(start, end));
    }
  }, [krathongs, batchIndex]);

  // กำหนดความเคลื่อนไหว
  const getRandomProps = (waveOptions: number[]) => {
    const waveY = waveOptions[Math.floor(Math.random() * waveOptions.length)];
    const dur = (15 + Math.random() * 15).toFixed(0);
    return { waveY, dur };
  };

  const waveLayers = [15, 75, 158];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      {/* พื้นหลังวิดีโอ */}
      <video
        src={isMobile ? "/videos/background2.mp4" : "/videos/background1.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-fill z-0"
      />

      {/* แสดงจำนวนกระทง */}
      {isMobile ? (
        <div className="absolute top-[30.2%] left-[58%] p-1 z-40 -translate-x-1/2">
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
        <div className="absolute top-[40%] left-[37.7%] p-1 z-40">
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
      <div className="absolute bottom-0 w-full flex flex-col items-center justify-end gap-y-10 h-[500px] overflow-visible">
        {displayKrathongs.map((k, layerIdx) => {
          const { waveY, dur } = getRandomProps(waveLayers);

          return (
            <svg
              key={`wave-${k.idx}-${layerIdx}`}
              viewBox={`0 0 ${width} 230`}
              className="absolute w-full h-[500px] top-16 left-0"
            >
              {/* กระทงและข้อความรวมกัน */}
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

                {/* กระทง */}
                <image
                  href={k.image_path}
                  x="-50"
                  y="-50"
                  width="100"
                  height="100"
                  opacity="1"
                />

                {/* ข้อความ */}
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
