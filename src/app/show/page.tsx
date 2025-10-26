"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function Show() {
  const router = useRouter();

  const [Desc, setDesc] = useState("");
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [showName, setShowName] = useState("");
  const [selectedPray, setSelectedPray] = useState<number | null>(null);

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
    if (!studentId || !fullName || !showName || selectedPray === null) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่องและเลือกคำอธิษฐาน 1 อย่าง");
      return;
    }

    const krathongImage =
      krathongData?.completeImage ||
      `/Krathong/Krathong${krathongData?.krathong !== undefined ? krathongData.krathong + 1 : 1}.png`;

    try {
      const { data, error } = await supabase
        .from("information")
        .insert([
          {
            student_id: Number(studentId),
            first_and_last_name: fullName,
            showName: showName,
            wish: Desc,
            image_path: krathongImage,
          },
        ])
        .select();

      if (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล:", JSON.stringify(error, null, 2));
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        return;
      }

      console.log("บันทึกข้อมูลเรียบร้อย:", data);

      localStorage.removeItem("selectedKrathongData");
      localStorage.removeItem("finalKrathongInfo");

      router.push("/");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดบางอย่าง");
    }
  };

  const krathongPath =
    krathongData?.completeImage ||
    `/Krathong/Krathong${krathongData?.krathong !== undefined ? krathongData.krathong + 1 : 1}.png`;

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center py-10 gap-8 px-4 sm:px-6 lg:px-8 font-[Prompt] overflow-hidden">
      <video
        src={isMobile ? "/videos/background4.mp4" : "/videos/background3.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-fill z-0"
      />

      <div className="absolute left-0 z-20 w-1/2 h-[70%] flex flex-col items-center justify-start">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col w-[360px]">
            <label className="font-bold text-[#000000] text-lg mb-1">รหัสนิสิต</label>
            <input
              type="number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="กรุณากรอกรหัสนิสิต"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C] bg-white text-black placeholder:text-[#0F0D13]/16"
            />
          </div>

          <div className="flex flex-col w-[368px]">
            <label className="font-bold text-[#000000] text-lg mb-1">ชื่อ-นามสกุล</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="กรุณากรอกชื่อ-นามสกุล"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C] bg-white text-black placeholder:text-[#0F0D13]/16"
            />
          </div>

          <div className="flex flex-col w-[368px]">
            <label className="font-bold text-[#000000] text-lg mb-1">ชื่อที่ต้องการแสดง</label>
            <input
              type="text"
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder="ชื่อที่แสดงบนกระทง"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C] bg-white text-black placeholder:text-[#0F0D13]/16"
            />
          </div>

          <div className="flex flex-col w-[368px]">
            <label className="font-bold text-[#000000] text-lg mb-1">
              คำอวยพร ({Desc.length} / 50 ตัวอักษร)
            </label>
            <textarea
              value={Desc}
              onChange={(e) => {
                if (e.target.value.length <= 50) setDesc(e.target.value);
              }}
              placeholder="ไม่เกิน 50 ตัวอักษร"
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#C49A6C] bg-white text-black placeholder:text-[#0F0D13]/16"
            />
          </div>
        </div>
      </div>

      <div className="absolute right-0 mr-50 z-20 w-1/3 h-[45%] flex flex-col items-center justify-center mb-15 bg-white/60 rounded-xl p-2 shadow-md">
        {krathongData ? (
          <div className="relative w-[320px] h-[280px]">
            <Image src={krathongPath} alt="กระทงของคุณ" fill className="object-contain" />
          </div>
        ) : (
          <p className="text-gray-500">กำลังโหลด...</p>
        )}
      </div>

      <div className="absolute bottom-30 w-[90%] md:w-[70%] bg-white/70 rounded-xl p-5 shadow-lg z-30">
        <div className="flex items-center gap-3">
          <h1 className="bg-[#D9D9D9] rounded-[50px] px-3 py-1 text-[24px] text-black">
            เลือกคำอธิษฐาน
          </h1>
          <h3 className="text-[18px] text-[#1E1E1E]/68">กรุณาเลือกคำอธิษฐาน 1 อย่าง</h3>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {prayList.map((pray, i) => (
            <div
              key={i}
              onClick={() => setSelectedPray(i)}
              className={`cursor-pointer flex flex-col items-center justify-start p-3 rounded-xl transition-all border min-h-30 ${
                selectedPray === i ? "border-pink-500 bg-pink-100 scale-105" : "border-transparent hover:bg-pink-50"
              }`}
            >
              <div className="w-20 h-20 flex items-center justify-center">
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

      <div className="absolute bottom-6 flex gap-4 z-40">
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
  );
}
