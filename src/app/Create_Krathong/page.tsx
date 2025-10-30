"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CreateKrathong() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [selectedKrathong, setSelectedKrathong] = useState<number | null>(null);
  const [selectedFlowers, setSelectedFlowers] = useState<number[]>([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const krathongNames = [
    "กระทงดอกบัว",
    "กระทงกรีบบัวอ่อน",
    "กระทงกรีบบัวม่วง",
    "กระทงใบตอง",
    "กระทงกรีบบัว",
    "กระทงดอกดาวเรือง",
    "กระทงกะลา",
    "กระทงขนมปังเต่า",
  ];

  const flowerNames = [
    "ดอกซากุระ",
    "ดอกเดซี่",
    "ดอกบัว",
    "ดอกลาเวนเดอร์",
    "ดอกคอสมอส",
  ];

  const handleSelectKrathong = (index: number) => {
    setSelectedKrathong(selectedKrathong === index ? null : index);
  };

  const handleSelectFlower = (index: number) => {
    if (selectedFlowers.includes(index)) {
      setSelectedFlowers(selectedFlowers.filter((i) => i !== index));
    } else if (selectedFlowers.length < 2) {
      setSelectedFlowers([...selectedFlowers, index]);
    }
  };

  const getCompleteKrathongPath = () => {
    if (selectedKrathong !== null && selectedFlowers.length === 2) {
      const [f1, f2] = [...selectedFlowers].sort((a, b) => a - b);
      return `/Krathong_Complet/${selectedKrathong + 1}${f1 + 1}${f2 + 1}.png`;
    }
    return null;
  };

  const completeImage = getCompleteKrathongPath();

  const handleSubmit = () => {
    if (selectedKrathong === null || selectedFlowers.length !== 2) {
      alert("กรุณาเลือกกระทง 1 แบบ และดอกไม้ 2 แบบก่อนดำเนินการต่อ");
      return;
    }
    const krathongData = {
      krathong: selectedKrathong,
      flowers: selectedFlowers,
      completeImage: completeImage,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("selectedKrathongData", JSON.stringify(krathongData));
    router.push("/show");
  };

  useEffect(() => {
    const data = localStorage.getItem("selectedKrathongData");
    if (data) {
      const parsed = JSON.parse(data);
      setSelectedKrathong(parsed.krathong ?? null);
      setSelectedFlowers(parsed.flowers ?? []);
    }
  }, []);

  return (
    <div className="relative min-h-screen font-[Prompt]">
      {/* Background video */}
      <video
        src={isMobile ? "/videos/background4.mp4" : "/videos/background3.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-fill z-0"
      />

      {isMobile ? (
        // Mobile layout
        <div className="absolute top-10 z-20 w-full h-full flex flex-col items-center px-4 overflow-y-auto pb-10">
          {/* เลือกกระทง */}
          <div className="bg-white/60 rounded-3xl p-5 shadow-lg w-full mb-5">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="bg-[#D9D9D9] rounded-full px-3 py-1 text-[12px] text-black">
                เลือกกระทง
              </h1>
              <h3 className="text-[10px] text-[#1E1E1E]/68">
                กรุณาเลือกกระทง 1 แบบ
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {krathongNames.map((name, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectKrathong(i)}
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    selectedKrathong === i ? "scale-105 border-3 border-pink-500 rounded-[14px]" : "hover:scale-105"
                  }`}
                >
                  <div className="relative w-24 h-24 md:w-28 md:h-28">
                    <Image src={`/Krathong/Krathong${i + 1}.png`} alt={name} fill className="object-contain" />
                  </div>
                  <p className="text-center text-[10px] mt-1 text-black">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* เลือกดอกไม้ */}
          <div className="bg-white/60 rounded-3xl p-5 shadow-lg w-full mb-5">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="bg-[#D9D9D9] rounded-full px-3 py-1 text-[12px] text-black">
                เลือกดอกไม้
              </h1>
              <h3 className="text-[10px] text-[#1E1E1E]/68">
                เลือกดอกไม้ {selectedFlowers.length}/2 แบบ
              </h3>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {flowerNames.map((name, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectFlower(i)}
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    selectedFlowers.includes(i) ? "scale-105 border-3 border-yellow-400 rounded-[14px]" : "hover:scale-105"
                  }`}
                >
                  <div className="relative w-20 h-20 md:w-24 md:h-24">
                    <Image src={`/flower/flower${i + 1}.png`} alt={name} fill className="object-contain" />
                  </div>
                  <p className="text-center text-[10px] mt-1 text-black">{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white/60 rounded-3xl flex flex-col items-center justify-center shadow-lg text-center w-full min-h-[300px] md:min-h-[300px] lg:min-h-[300px] mb-5">
            {selectedKrathong !== null ? (
              <div className="flex flex-col items-center">
                <div className="relative w-50 h-50 mb-4 animate-gentle-bounce">
                  <Image
                    src={completeImage || `/Krathong/Krathong${selectedKrathong + 1}.png`}
                    alt="Selected Krathong"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-lg font-medium text-black">{krathongNames[selectedKrathong]}</p>
              </div>
            ) : (
              <p className="text-gray-600">กรุณาเลือกกระทง</p>
            )}
            <style jsx>{`
              @keyframes gentle-bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              .animate-gentle-bounce {
                animation: gentle-bounce 2s ease-in-out infinite;
              }
            `}</style>
          </div>
          <button
            onClick={handleSubmit}
            disabled={selectedKrathong === null || selectedFlowers.length !== 2}
            className={`px-10 py-2 text-2xl rounded-full shadow-lg mb-2 transition ${
              selectedKrathong === null || selectedFlowers.length !== 2
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white/80 text-black hover:scale-105"
            }`}
          >
            ตกลง
          </button>
        </div>
      ) : (
        <div className="relative min-h-screen font-[Prompt]">
          <div className="absolute top-10 z-20 w-full h-4/5 flex flex-row px-10 gap-10 overflow-y-auto">
            <div className="w-1/2 flex flex-col gap-5">
              <div className="bg-white/60 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="bg-[#D9D9D9] rounded-full px-3 py-1 text-[24px] text-black">
                    เลือกกระทง
                  </h1>
                  <h3 className="text-[18px] text-[#1E1E1E]/68">กรุณาเลือกกระทง 1 แบบ</h3>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {krathongNames.map((name, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectKrathong(i)}
                      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                        selectedKrathong === i ? "scale-105 border-3 border-pink-500 rounded-[14px]" : "hover:scale-105"
                      }`}
                    >
                      <div className="relative w-24 h-24 md:w-28 md:h-28">
                        <Image src={`/Krathong/Krathong${i + 1}.png`} alt={name} fill className="object-contain" />
                      </div>
                      <p className="text-center text-sm mt-1 text-black">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/60 rounded-3xl p-5 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="bg-[#D9D9D9] rounded-full px-3 py-1 text-[24px] text-black">เลือกดอกไม้</h1>
                  <h3 className="text-[18px] text-[#1E1E1E]/68">เลือกดอกไม้ {selectedFlowers.length}/2 แบบ</h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {flowerNames.map((name, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectFlower(i)}
                      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                        selectedFlowers.includes(i) ? "scale-105 border-3 border-yellow-400 rounded-[14px]" : "hover:scale-105"
                      }`}
                    >
                      <div className="relative w-20 h-20 md:w-24 md:h-24">
                        <Image src={`/flower/flower${i + 1}.png`} alt={name} fill className="object-contain" />
                      </div>
                      <p className="text-center text-sm mt-1 text-black">{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ขวา: Preview */}
            <div className="w-1/2 flex items-center justify-center">
              <div className="bg-white/60 rounded-3xl p-10 shadow-lg text-center w-3/4 h-full flex flex-col items-center justify-center">
                {selectedKrathong !== null ? (
                  <div className="flex flex-col items-center">
                    {/* เอา class animate-gentle-bounce ใส่กับ div รอบ Image */}
                    <div className="relative w-50 h-50 mb-4 animate-gentle-bounce">
                      <Image
                        src={completeImage || `/Krathong/Krathong${selectedKrathong + 1}.png`}
                        alt="Selected Krathong"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-lg font-medium text-black">{krathongNames[selectedKrathong]}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">กรุณาเลือกกระทง</p>
                )}

                {/* ใส่ style animation */}
                <style jsx>{`
                  @keyframes gentle-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                  }
                  .animate-gentle-bounce {
                    animation: gentle-bounce 2s ease-in-out infinite;
                  }
                `}</style>
              </div>
            </div>
          </div>
          <button
              onClick={handleSubmit}
              disabled={selectedKrathong === null || selectedFlowers.length !== 2}
              className={`z-40 px-10 py-2 text-2xl rounded-full absolute bottom-8 left-1/2 transform -translate-x-1/2 shadow-[0_0_25px_10px_rgba(255,255,255,0.6)] transition ${
                selectedKrathong === null || selectedFlowers.length !== 2
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#FFFFFF]/80 text-black hover:scale-105 transition-all"
              }`}
            >
              ตกลง
          </button>
        </div>
      )}
    </div>
  );
}
