"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserLogged } from "@/app/lib/api/login";
import Navbar from "@/app/components/Navbar";
import SidePanel from "@/app/components/SidePanel";
import { logout } from "@/app/lib/api/logout";

export default function MyProfile() {
  const [authUser, setAuthUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const router = useRouter();

  async function onLogoutHandler() {
    await logout();
    setAuthUser(null);
  }
  useEffect(() => {
    const getUser = async () => {
      const { error, data } = await getUserLogged();

      if (error) {
        console.log("Token Invalid & Data user gagal terambil");
        return;
      }

      console.log("Data pengguna :", data);
      setAuthUser(data);
      setEmail(data.email);
      setName(data.fullname);
    };
    getUser();
  }, []);

  return (
    <div className="min-h-screen h-screen w-full font-[family-name:var(--font-geist-sans)] overflow-y-hidden">
      <Navbar
        authUser={authUser}
        roles={authUser !== null && authUser.tipe}
        fullName={authUser !== null && authUser.fullname}
        email={authUser !== null && authUser.email}
        saldo={authUser !== null && authUser.saldo}
        logout={onLogoutHandler}
      />
      <main
        className={`flex flex-col lg:flex-row mx-5 gap-4  overflow-hidden h-[calc(100vh-88px)]`}
      >
        <SidePanel />
        <div id="main-content" className="w-full flex flex-col gap-8">
          {/**Kolom 1: Perjudulan */}
          <div className="flex w-full justify-between items-center">
            <div className="flex flex-col gap-1.5">
              <h2 className="font-medium text-2xl">Account Setting</h2>
              <p className="font-medium text-base text-[#777]">
                Kelola profil akun Anda
              </p>
            </div>
            <div>
              <button className="bg-black rounded-lg px-6 py-2 text-white">
                Save
              </button>
            </div>
          </div>
          {/**Kolom 2: Data orang(Foto profil, Nama, Email, dan Nomor telepom) */}
          <div className="flex flex-col gap-3.5">
            <div className="flex flex-col gap-2.5">
              <p>Foto Profil</p>
              <div className="flex gap-2.5 items-center">
                <div className="rounded-full w-[72px] h-[72px] bg-gray-400 cursor-pointer "></div>
                <div className="flex flex-col gap-2.5">
                  <div className=" flex gap-2.5">
                    <button className="bg-black text-white px-3 py-2 rounded-lg">
                      Unggah Foto
                    </button>
                    <button className="bg-white px-4 py-2 border-2 rounded-lg border-[rgba(0,0,0,0.16)]">
                      Hapus Foto
                    </button>
                  </div>
                  <p className="font-medium text-base text-[#a3a3a3]">
                    Format file harus dalam bentuk JPG atau PNG. Ukuran file
                    maksimum 5MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3.5">
              <div className="flex w-full gap-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama" className="block">
                    Nama
                  </label>
                  <input
                    type="text"
                    id="nama"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={name}
                    className="bg-[#F2F5F7] rounded-xl py-3 px-4 w-[420px] block"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="block">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder={email}
                    onChange={setEmail}
                    className="bg-[#F2F5F7] text-[#B3B3B3] rounded-xl py-3 px-4 w-[420px] block"
                    disabled
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber">Nomor Telepon</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+62 8123 4567 89"
                  className="bg-[#F2F5F7] rounded-xl py-3 px-4 w-[864px] block"
                />
              </div>
            </div>
          </div>
          {/**Kolom 3: Tombol untuk ganti password */}
          <div className="flex flex-col gap-2.5">
            <h2 className="text-2xl font-medium text-black">Password</h2>
            <p className="text-[#777] text-base font-medium">
              Jika anda lupa password atau ingin mengubah password, klik tombol
              di bawah
            </p>
            <button
              className="border-2 border-[rgba(0,0,0,0.16)] px-3 py-2 rounded-lg cursor-pointer w-[147px]"
              onClick={() => router.push("/ForgotPass")}
            >
              Ubah Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
