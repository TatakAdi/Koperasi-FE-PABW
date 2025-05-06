"use client";
import EmailVerifBox from "@/components/EmailVerifBox";
import { verifyEmail } from "@/lib/api/verifyEmail";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OTPCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const flow = searchParams.get("flow");
  const router = useRouter();

  const [status, setStatus] = useState("loading"); // loading, success, error, idle

  useEffect(() => {
    if (token) {
      setStatus("loading");
      verifyEmail(token).then((res) => {
        if (res.succes) {
          setStatus("success");
          console.log(res.message);
          setTimeout(() => {
            if (flow === "login") {
              router.push("/");
            } else {
              router.push("/Login");
            }
          }, 2000);
        } else {
          setStatus("error");
          console.error(res.message);
        }
      });
    } else {
      setStatus("idle");
    }
  }, [token, router]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <EmailVerifBox email={email} status={status} />
    </div>
  );
}
