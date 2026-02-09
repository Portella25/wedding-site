"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center mx-4 md:mx-8 min-w-[70px] md:min-w-[100px]">
      <div className="text-5xl md:text-7xl font-serif text-[#C8A049] font-normal tracking-tight">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#9a9a9a] mt-4 font-medium">
        {label}
      </div>
    </div>
  );
}

function Separator() {
  return (
    <span className="text-[#E5D5A8] text-4xl md:text-6xl font-light font-serif italic opacity-60 pb-8">
      /
    </span>
  );
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Data do casamento: 19 de Setembro de 2026 às 16:00
    const targetDate = new Date("2026-09-19T16:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
      className="flex justify-center items-center py-10 relative"
    >
      <TimeUnit value={timeLeft.days} label="Dias" />
      <Separator />
      <TimeUnit value={timeLeft.hours} label="Horas" />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Min" />
      <Separator />
      <TimeUnit value={timeLeft.seconds} label="Seg" />
    </motion.div>
  );
}
