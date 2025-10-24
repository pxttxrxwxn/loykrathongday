"use client";

import React from "react";
import Image from "next/image";

export default function CreateKrathong() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#DBE5F4] via-[#FFEA93] to-[#FFABBF] flex flex-col items-center py-10 gap-8 px-4 sm:px-6 lg:px-8">

      {/* กล่องเลือกกระทง */}
      <SectionBox title="เลือกกระทง" folder="Krathong" count={8} />

      {/* กล่องเลือกดอกไม้ */}
      <SectionBox title="เลือกดอกไม้" folder="flower" count={5} />

      {/* กล่องเลือกธูปเทียน */}
      <SectionBox title="เลือกของตกแต่ง" folder="candle" count={9} />

      {/* ปุ่มไปหน้าต่อไป */}
      <button className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all">
        ตกลง
      </button>
    </div>
  );
}

/* ✅ คอมโพเนนต์ย่อยสำหรับกล่องแต่ละหมวด */
function SectionBox({
  title,
  folder,
  count,
}: {
  title: string;
  folder: string;
  count: number;
}) {
  // คำนวณจำนวนแถว
  const columns = 3;
  const rows = Math.ceil(count / columns);

  return (
    <div
      className={`w-full max-w-xl bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl flex flex-col items-start p-4 border border-white/40`}
      style={{
        minHeight: rows * 90 + 70, // 90 = ขนาดรูป+padding, 70 = สำหรับหัวข้อและ padding
      }}
    >
      {/* หัวข้อ */}
        <div className="bg-[#D9D9D9] text-black text-[16px] font-bold text-left px-6 py-2 rounded-[24px] mb-4 shadow-sm">
        {title}
        </div>

      {/* กริดรูปภาพ */}
      <div className="grid grid-cols-3 gap-3 w-full justify-items-center">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-100 hover:bg-pink-100 rounded-xl p-2 cursor-pointer transition-all shadow-sm hover:shadow-md"
          >
            <Image
              src={`/${folder}/${folder}${i + 1}.png`}
              alt={`${folder} ${i + 1}`}
              width={72}
              height={65}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

