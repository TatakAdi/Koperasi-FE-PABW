import React from "react";

// Mapping role ke style sesuai design (warna HEX sesuai permintaan)
const ROLE_STYLES = {
  admin: {
    label: "Admin",
    className:
      "px-1.5 py-0.5 bg-[#F2E9FF] rounded-lg flex justify-center items-center gap-2.5 outline outline-1 outline-[#E5E5E5]",
    textClass: "text-[#7348C0]",
  },
  penitip: {
    label: "Penitip",
    className:
      "px-1.5 py-0.5 bg-[#FFF9E5] rounded-lg flex justify-center items-center gap-1 outline outline-1 outline-[#E5E5E5]",
    textClass: "text-[#A35200]",
  },
  anggota: {
    label: "Anggota",
    className:
      "px-1.5 py-0.5 bg-[#EBFAEB] rounded-lg flex justify-center items-center gap-1 outline outline-1 outline-[#E5E5E5]",
    textClass: "text-[#297A3A]",
  },
  pegawai: {
    label: "Pegawai",
    className:
      "px-1.5 py-0.5 bg-[#D6FAFF] rounded-lg flex justify-center items-center gap-1 outline outline-1 outline-[#E5E5E5]",
    textClass: "text-[#2167B9]",
  },
};

export default function Privilage({ value }) {
  const role = ROLE_STYLES[value];
  if (!role) return null;
  return (
    <div className={role.className}>
      <div className="flex justify-start items-center gap-1">
        <div className={`text-base font-medium font-['Geist'] leading-normal ${role.textClass}`}>
          {role.label}
        </div>
      </div>
    </div>
  );
}