"use client";
import Image from "next/image";
import EmailVerifBox from "@/components/EmailVerifBox";
import { useSearchParams } from "next/navigation";

export default function EmailVerif({ email }) {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <EmailVerifBox email={email} />
    </div>
  );
}
