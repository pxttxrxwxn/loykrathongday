"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // แสดงป๊อปอัพทันทีเมื่อเข้าหน้า
    setShowPopup(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-purple-500 to-blue-400 flex items-center justify-center">
      {/* ป๊อปอัพ */}
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
              className="absolute top-0 right-1 bg-white/0 rounded-full p-2 text-xl font-bold text-black transition"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
