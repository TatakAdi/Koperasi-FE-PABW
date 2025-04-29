"use client";
import EmailVerifBox from "@/components/EmailVerifBox";
import { verifyEmail } from "@/lib/api/verifyEmail";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EmailVerif() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const router = useRouter();

  const [status, setStatus] = useState("loading"); // loading, success, error, idle
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token) {
      setStatus("loading");
      verifyEmail(token).then((res) => {
        if (res.succes) {
          setStatus("success");
          setMessage(res.message);
          setTimeout(() => {
            router.push("/Login");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(res.message);
        }
      });
    } else {
      setStatus("idle");
    }
  }, [token, router]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <EmailVerifBox email={email} />
    </div>
  );
}
