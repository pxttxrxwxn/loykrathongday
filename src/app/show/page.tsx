"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Show() {
  const router = useRouter();

  const [Desc, setDesc] = useState("");
  const [showName, setShowName] = useState("");
  const [role, setRole] = useState("");
  const [selectedPray, setSelectedPray] = useState<number | null>(null);
  const [errors, setErrors] = useState({
    showName: false,
    selectedPray: false,
    role: false,
  });

  interface KrathongData {
    krathong: number;
    completeImage?: string;
  }

  const [krathongData, setKrathongData] = useState<KrathongData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("selectedKrathongData");
    if (data) {
      setKrathongData(JSON.parse(data));
    } else {
      alert("ยังไม่ได้เลือกรูปกระทง กรุณากลับไปเลือกก่อนค่ะ");
      router.push("/Create_Krathong");
    }
  }, [router]);

  const prayList = [
    { name: "เหรียญ", detail: "เงินทองไหลมาเทมาตลอดทั้งปี" },
    { name: "ข้าวสาร", detail: "มั่นคง อุดมสมบูรณ์" },
    { name: "กลีบกุหลาบ", detail: "สมหวัง ไร้อุปสรรค" },
    { name: "ดอกบัว", detail: "สติปัญญา ความสำเร็จในชีวิต" },
    { name: "ดอกจำปี", detail: "ความเจริญก้าวหน้า" },
    { name: "ดอกกล้วยไม้", detail: "สุขภาพแข็งแรง อายุยืนยาว" },
  ];

  const handleSubmit = async () => {
    const newErrors = {
      showName: !showName,
      selectedPray: selectedPray === null,
      role: !role,
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    try {
      const krathongImage =
        krathongData?.completeImage ||
        `/Krathong/Krathong${
          krathongData?.krathong !== undefined
            ? krathongData.krathong + 1
            : 1
        }.png`;

      const { error } = await supabase
        .from("information")
        .insert([
          {
            showName: showName,
            wish: Desc,
            image_path: krathongImage,
            Role: role,
          },
        ])
        .select();

      if (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", error);
        return;
      }

      localStorage.removeItem("selectedKrathongData");
      localStorage.removeItem("finalKrathongInfo");
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const krathongPath =
    krathongData?.completeImage ||
    `/Krathong/Krathong${
      krathongData?.krathong !== undefined ? krathongData.krathong + 1 : 1
    }.png`;

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center py-10 gap-8 px-4 sm:px-6 lg:px-8 font-[Prompt]">
      <video
        src={isMobile ? "/videos/background4.mp4" : "/videos/background3.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-fill z-0"
      />
      {isMobile ? (
      <div className="absolute z-20 flex w-full items-center justify-start">
        <div className="flex gap-5 w-full tems-center justify-center">
          <div className="grid grid-rows-1 gap-9 w-[80%]">
            <div className="bg-white/60 rounded-xl p-2 shadow-md flex flex-col items-center justify-center">
              {krathongData ? (
                <div className="relative w-[260px] h-[280px]">
                  <Image src={krathongPath} alt="กระทงของคุณ" fill className="object-contain" />
                </div>
              ) : (
                <p className="text-gray-500">กำลังโหลด...</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-[#000000] text-lg mb-1">
                ชื่อที่ต้องการแสดง
              </label>
              <input
                type="text"
                value={showName}
                onChange={(e) => {
                  setShowName(e.target.value);
                  if (errors.showName && e.target.value) {
                    setErrors((prev) => ({ ...prev, showName: false }));
                  }
                }}
                placeholder="ชื่อที่แสดงบนกระทง"
                className={`p-2 rounded focus:outline-none focus:ring-2 border bg-white text-black placeholder:text-[#0F0D13]/16
                  ${errors.showName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#C49A6C]"}`}
              />
            </div>
            <div className="flex">
              <label className="text-[#000000] text-lg mb-1">
                บุคลากร
              </label>
              <div className="grid grid-2">
                  <label className="flex items-center gap-2 ml-10">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="p-1 rounded text-black">นิสิต / นักเรียน</span>
                  </label>
                  <label className="flex items-center gap-2 ml-10">
                    <input
                      type="radio"
                      name="role"
                      value="internal"
                      checked={role === "internal"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="p-1 rounded text-black">บุคลากรภายในมหาวิทยาลัย</span>
                  </label>
                  <label className="flex items-center gap-2 ml-10">
                    <input
                      type="radio"
                      name="role"
                      value="external"
                      checked={role === "external"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="px-1 rounded text-black">บุคลากรภายนอก</span>
                  </label>
                </div>
            </div>
            <div className="flex flex-col">
              <label className="text-[#000000] text-lg mb-1">
                คำอวยพร ({Desc.length} / 50 ตัวอักษร)
              </label>
              <textarea
                value={Desc}
                onChange={(e) => {if (e.target.value.length <= 50) setDesc(e.target.value);}}
                placeholder="ไม่เกิน 50 ตัวอักษร"
                className="p-2 rounded focus:outline-none focus:ring-2 border focus:ring-[#C49A6C] bg-white text-black placeholder:text-[#0F0D13]/16"
              />
            </div>
            <div className=" bg-white/80 rounded-xl p-5 shadow-lg z-30 mt-2  mb-20">
              <div className="flex items-center gap-3">
                <h1 className="bg-[#D9D9D9] rounded-[50px] px-3 py-1 text-[12px] text-black">
                  เลือกคำอธิษฐาน
                </h1>
                <h3 className="text-[10px] text-[#1E1E1E]/68">
                  กรุณาเลือกคำอธิษฐาน 1 อย่าง
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {prayList.map((pray, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPray(i)}
                    className={`cursor-pointer flex flex-col items-center justify-start p-1 rounded-xl transition-all border min-h-1 ${
                      selectedPray === i ? "border-pink-500 bg-pink-100 scale-105" : "border-transparent hover:bg-pink-50"
                    }`}
                  >
                    <div className="w-15 h-15 flex items-center justify-center">
                      <Image
                        src={`/pray/pray${i + 1}.png`}
                        alt={pray.name}
                        width={80}
                        height={80}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-black font-semibold text-[11px] mt-2 text-center">{pray.name}</p>
                    <p className="text-[9px] text-gray-500 text-center">{pray.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-6 flex gap-4 z-40 mt-8">
            <Link
              href="/Create_Krathong"
              className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all"
            >
              ย้อนกลับ
            </Link>
            <button
              onClick={handleSubmit}
              className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all"
            >
              ตกลง
            </button>
          </div>
        </div>
      </div>
      ) : (
      <div className="relative h-9/10 w-full flex flex-col items-center gap-8 px-4 sm:px-6 lg:px-8 font-[Prompt]">
        <div className="absolute z-20 flex flex-col w-full items-center justify-start">
          <div className="flex gap-5 w-[80%]">
            <div className="grid grid-2 gap-5 w-1/1">
              <div className=" bg-white/70 rounded-xl p-3 shadow-lg z-30">
                <div className="flex items-center gap-3">
                  <h1 className="bg-[#D9D9D9] rounded-[50px] px-3 py-1 text-[20px] text-black">
                    บุคลากร
                  </h1>
                </div>
                <div className="grid grid-2">
                  <label className="flex items-center gap-2 ml-10">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === "student"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="p-1 rounded text-black">นิสิต / นักเรียน</span>
                  </label>
                  <label className="flex items-center gap-2 ml-10">
                    <input
                      type="radio"
                      name="role"
                      value="internal"
                      checked={role === "internal"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="p-1 rounded text-black">บุคลากรภายในมหาวิทยาลัย</span>
                  </label>
                  <label className="flex items-center gap-2 ml-10">
                    <input
                      type="radio"
                      name="role"
                      value="external"
                      checked={role === "external"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="px-1 rounded text-black">บุคลากรภายนอก</span>
                  </label>
                </div>
              </div>
              <div className="bg-white/70 rounded-xl p-5 shadow-lg z-30">
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col">
                    <label className="text-[#000000] text-lg mb-1">
                      ชื่อที่ต้องการแสดง
                    </label>
                    <input
                      type="text"
                      value={showName}
                      onChange={(e) => {
                        setShowName(e.target.value);
                        if (errors.showName && e.target.value) {
                          setErrors((prev) => ({ ...prev, showName: false }));
                        }
                      }}
                      placeholder="ชื่อที่แสดงบนกระทง"
                      className={`p-2 rounded focus:outline-none focus:ring-2 border bg-white text-black placeholder:text-[#0F0D13]/16
                        ${errors.showName ? "border-red-500 focus:ring-red-400" : "border-gray-300 focus:ring-[#C49A6C]"}`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[#000000] text-lg mb-1">
                      คำอวยพร ({Desc.length} / 50 ตัวอักษร)
                    </label>
                    <textarea
                      value={Desc}
                      onChange={(e) => {if (e.target.value.length <= 50) setDesc(e.target.value);}}
                      placeholder="ไม่เกิน 50 ตัวอักษร"
                      className="p-2 rounded focus:outline-none focus:ring-2 border focus:ring-[#C49A6C] bg-white text-black placeholder:text-[#0F0D13]/16"
                    />
                  </div>
                </div>
              </div>
              <div className=" bg-white/70 rounded-xl p-3 shadow-lg z-30 mt-2">
                <div className="flex items-center gap-3">
                  <h1 className="bg-[#D9D9D9] rounded-[50px] px-3 py-1 text-[20px] text-black">
                    เลือกคำอธิษฐาน
                  </h1>
                  <h3 className="text-[18px] text-[#1E1E1E]/68">
                    กรุณาเลือกคำอธิษฐาน 1 อย่าง
                  </h3>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {prayList.map((pray, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPray(i)}
                      className={`cursor-pointer flex flex-col items-center justify-start p-1 rounded-xl transition-all border min-h-30 ${
                        selectedPray === i ? "border-pink-500 bg-pink-100 scale-105" : "border-transparent hover:bg-pink-50"
                      }`}
                    >
                      <div className="w-15 h-15 flex items-center justify-center">
                        <Image
                          src={`/pray/pray${i + 1}.png`}
                          alt={pray.name}
                          width={80}
                          height={80}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-black font-semibold text-sm mt-2 text-center">{pray.name}</p>
                      <p className="text-xs text-gray-500 text-center">{pray.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white/60 rounded-xl p-2 shadow-md flex flex-col items-center justify-center w-[60%]">
              {krathongData ? (
                <div className="relative w-[320px] h-[280px]">
                  <Image src={krathongPath} alt="กระทงของคุณ" fill className="object-contain" />
                </div>
              ) : (
                <p className="text-gray-500">กำลังโหลด...</p>
              )}
            </div>
          </div>
        </div>
        <div className="fixed bottom-10 left-0 w-full flex justify-center gap-4 z-40">
          <Link
            href="/Create_Krathong"
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            ย้อนกลับ
          </Link>
          <button
            onClick={handleSubmit}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all"
          >
            ตกลง
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
