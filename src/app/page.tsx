"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, #DBE5F4 0%, #FFEA93 22%, #FFD5A1 35%, #FFABBF 50%, #FF81DC 75%, #FA2BF3 100%)",
        minHeight: "100vh",
      }}
      className="flex items-center justify-center"
    >
      <Link
        href="/Create_Krathong"
        className="text-2xl font-semibold text-white bg-pink-500 px-6 py-3 rounded-2xl shadow-lg hover:bg-pink-600 transition-all"
      >
        Create Krathong
      </Link>
    </div>
  );
}
