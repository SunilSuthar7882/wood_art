"use client";

import React from "react";
import Image from "next/image";

const CommonProfilePic = ({ fullName, profileImage }) => {
  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "NA";

  return (
    <div className="flex items-center gap-3">
      {profileImage ? (
        <Image
          src={profileImage}
          alt={fullName || "Profile picture"} // ✅ alt is now required
          width={32}
          height={32}
          className="rounded-full object-cover border-[1px] border-green-400"
          style={{
            borderRadius: "9999px",
            width: "32px",
            height: "32px",
          }}
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-300 text flex items-center justify-center text-sm font-medium border-[1px] border-green-400">
          {initials}
        </div>
      )}
      <span>{fullName}</span>
    </div>
  );
};

export default CommonProfilePic;
