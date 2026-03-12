"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const FlippingCard = ({ imageSrc }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the flip/move after 80px of scrolling
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    /* LAYER 1: The Positional Wrapper 
       Handles the "Move from center to right" logic.
    */
    <div
      className={`fixed z-40 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] 
      ${
        isScrolled
          ? "top-[75%] left-[85%] w-[150px] md:w-[250px]"
          : "top-1/2 left-1/2 w-[280px] md:w-[350px]"
      } -translate-x-1/2 -translate-y-1/2 aspect-[4/5] perspective-1200`}
    >
      {/* LAYER 2: The Flipping Card 
         Handles the "180-degree rotation" and maintains 3D space.
      */}
      <div
        className={`relative w-full h-full transition-transform duration-1000 preserve-3d 
        ${isScrolled ? "rotate-y-180" : ""}`}
      >
        
        {/* FRONT FACE: The Furniture Photo */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={imageSrc}
            alt="Furniture Front"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* BACK FACE: The Brand Widget */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-[#1a1a1a] rounded-2xl flex flex-col items-center justify-center p-6 shadow-2xl border border-white/10">
          <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-[10px] font-bold">WA</span>
          </div>
          <h3 className="text-white font-black text-lg uppercase tracking-tighter text-center leading-tight">
            Interior <br /> Excellence
          </h3>
          <div className="mt-6 px-5 py-2 bg-white text-black text-[10px] font-bold rounded-full uppercase tracking-widest cursor-pointer hover:bg-gray-200 transition-colors">
            Shop Now
          </div>
        </div>

      </div>
    </div>
  );
};

export default FlippingCard;