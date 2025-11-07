"use client";
import { useRouter } from "next/navigation";

export default function StartPage() {
  const router = useRouter();

  const start = () => {
    // กดปุ่ม = อนุญาตเล่นเสียงแน่นอน
    localStorage.setItem("allowMusic", "true");
    router.push("/");
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black text-white">
      <button
        onClick={start}
        className="px-6 py-3 text-xl bg-white text-black rounded-lg"
      >
        ▶ เริ่มประสบการณ์
      </button>
    </div>
  );
}
