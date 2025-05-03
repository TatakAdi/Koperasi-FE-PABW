"use client";
import Image from "next/image";
import Navbar from "./components/Navbar";
import { getUserLogged } from "./lib/api/login";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [authUser, setAuthUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();

      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }

      console.log("Data pengguna :", data);
      setAuthUser(data);
      router.push("/Welcome");
    };
    getUser();
  }, []);

  // if (authUser !== null) {
  //   router.push("/Welcome");
  // }

  return (
    <div className="min-h-screen w-full font-[family-name:var(--font-geist-sans)] ">
      <Navbar />
    </div>
  );
}
