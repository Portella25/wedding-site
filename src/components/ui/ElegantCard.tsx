import React from "react";
import { cn } from "@/lib/utils";

interface ElegantCardProps {
  title?: string;
  subtitle?: string; // e.g. "15 de Junho de 2026"
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function ElegantCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: ElegantCardProps) {
  return (
    <div
      className={cn(
        "relative w-full max-w-2xl mx-auto bg-white shadow-2xl p-8 md:p-16 flex flex-col items-center justify-center text-center border border-[#E5E0D8]",
        // Aspect ratio is handled by the container or content mostly, but we can enforce a minimum
        "min-h-[400px]",
        className
      )}
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 shadow-[0_0_80px_-20px_rgba(212,175,55,0.15)] pointer-events-none rounded-sm" />

      {/* Content Container */}
      <div className="flex-1 flex flex-col items-center justify-center w-full space-y-6 z-10">
        {/* Header */}
        {title && (
          <div className="space-y-4 mb-4">
            <h2 className="font-serif text-3xl md:text-5xl text-[#C9A34A] tracking-tight font-bold">
              {title}
            </h2>
            
            {/* Ornament Separator */}
            <div className="flex items-center justify-center gap-3 opacity-80">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A34A]" />
              <div className="w-24 h-[1px] bg-[#C9A34A]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#C9A34A]" />
            </div>

            {subtitle && (
              <p className="font-serif text-lg md:text-xl text-[#9C8B7A] mt-4 font-light">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Body */}
        <div className="font-serif text-base md:text-lg text-[#9C8B7A] space-y-4 leading-relaxed font-light">
          {children}
        </div>
      </div>

      {/* Footer */}
      {footer && (
        <div className="absolute bottom-6 md:bottom-8 text-[10px] md:text-xs font-serif text-[#C9A34A] tracking-widest opacity-60">
          {footer}
        </div>
      )}
    </div>
  );
}
