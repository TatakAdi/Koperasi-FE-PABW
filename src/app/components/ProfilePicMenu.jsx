import { showIuranWajib } from "@/app/lib/api/config";
import { getUserLogged } from "@/app/lib/api/login";
import {
  KeyRound,
  List,
  LogIn,
  LogOut,
  Package,
  Store,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePicMenu({
  fullName,
  email,
  roles,
  authed, // Asumsi ini adalah boolean atau truthy/falsy untuk status autentikasi
  logout, // Fungsi logout
  saldo,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const adminPages = ["/Actors", "/Statistic", "/Sellings", "/Product"];
  const isAdminPages = adminPages.some((page) => pathname.startsWith(page));
  const [iuranWajib, setIuranWajib] = useState({
    jumlah: "0",
    tanggal: 1,
  });
  const [lastPayment, setLastPayment] = useState(null);

  const handleAdminOrProductPageRedirect = () => {
    if (roles === "admin") {
      if (isAdminPages) {
        router.push("/");
      } else {
        router.push("/Actors");
      }
    } else if (roles === "pegawai") {
      if (pathname === "/Sellings") {
        router.push("/");
      } else {
        router.push("/Sellings");
      }
    } else if (roles === "penitip" || roles === "pengguna") {
      if (pathname === "/MyProduct") {
        router.push("/");
      } else {
        router.push("/MyProduct");
      }
    }
  };

  // Fungsi baru untuk menangani logout dan pengalihan
  const handleLogoutAndRedirect = async () => {
    router.push("/");
    await logout();
  };

  useEffect(() => {
    const fetchIuranWajib = async () => {
      try {
        const result = await showIuranWajib();
        if (!result.error && result.data?.data) {
          const configData = result.data.data;
          setIuranWajib({
            jumlah: configData.value || "0",
            tanggal: parseInt(configData.key2, 10) || 1,
          });
        }
      } catch (error) {
        console.error("Error fetching iuran wajib:", error);
      }
    };

    const fetchUserData = async () => {
      if (!authed) return;

      try {
        const { error, data } = await getUserLogged();
        if (!error && data) {
          // Format the payment date if exists
          const paymentDate = data.last_payment_date
            ? new Date(data.last_payment_date).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
            : "02/12/23"; // fallback date
          setLastPayment(paymentDate);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchIuranWajib();
    fetchUserData();
  }, [authed]);

  const styleBox =
    "flex flex-row text-sm font-medium text-[#535353] p-2 cursor-pointer hover:bg-[#EDEDED] rounded-lg gap-2 m-2";

  return (
    <div className="w-[420px] flex flex-col bg-[#F2F4F7] rounded-lg">
      {authed !== null && (
        <div className="flex h-[74px] items-center gap-2 mx-2">
          <div className="rounded-full w-10 h-10 bg-gray-400 cursor-pointer "></div>
          <div>
            <p className="font-medium text-black">{fullName || "Guest"}</p>
            <p className="font-medium text-[#737373]">{email || "N/A"}</p>
          </div>
        </div>
      )}
      <div
        className={`${
          authed !== null ? "border-y " : "border-b "
        } border-[#E6E6E6]`}
      >
        <div
          className={`${styleBox}`}
          onClick={() => router.push("/account-setting")}
        >
          <User size={20} />
          <span>Account Setting</span>{" "}
        </div>

        <div className={`${styleBox}`} onClick={() => router.push("/MyOrders")}>
          <List size={20} />
          <span>My Orders</span>
        </div>

        {authed && (
          <div className={`${styleBox}`} onClick={handleAdminOrProductPageRedirect}>
            {roles === "admin" ? (
              isAdminPages ? (
                <>
                  <Store size={20} />
                  <span>Main Page</span>
                </>
              ) : (
                <>
                  <KeyRound size={20} />
                  <span>Admin Panel</span>
                </>
              )
            ) : roles === "pegawai" ? (
              pathname === "/Sellings" ? (
                <>
                  <Store size={20} />
                  <span>Main Page</span>
                </>
              ) : (
                <>
                  <KeyRound size={20} />
                  <span>Pegawai Panel</span>
                </>
              )
            ) : (
              pathname === "/MyProduct" ? (
                <>
                  <Store size={20} />
                  <span>Main Page</span>
                </>
              ) : (
                <>
                  <Package size={20} />
                  <span>My Products</span>
                </>
              )
            )}
          </div>
        )}
      </div>

      {authed !== null && (
        <div className="border-b border-[#e6e6e6]">
          <div className="flex flex-row gap-1 justify-between items-center m-2 p-2">
            <div>
              <p className="text-[#535353] font-base text-base">
                Iuran Sukarela
              </p>
              <p className="font-medium text-base text-black">
                Rp.{" "}
                {saldo !== null && saldo !== undefined
                  ? saldo.toLocaleString("id-ID")
                  : "0"}
              </p>
              <p className="text-[#666666] font-medium text-xs">
                Last Payment: {lastPayment || "02/12/23"}
              </p>
            </div>
            <div>
              <p className="text-[#535353] font-base text-base">Iuran Wajib</p>
              <p className="font-medium text-base text-black">
                Rp. {parseInt(iuranWajib.jumlah).toLocaleString("id-ID")}
              </p>
              <p className="text-[#666666] font-medium text-xs">
                Last Payment: {lastPayment || "02/12/23"}
              </p>
            </div>
          </div>
        </div>
      )}
      <div
        // Perbarui onClick untuk menggunakan fungsi baru saat logout
        onClick={
          !authed ? () => router.push("/Login") : handleLogoutAndRedirect
        }
        className={` ${styleBox} `}
      >
        {!authed ? (
          <LogIn size={20} stroke="green" />
        ) : (
          <LogOut size={20} stroke="red" />
        )}
        <span className={`${!authed ? "text-[#199F48]" : "text-[#E50000]"}`}>
          {!authed ? "Log in" : "Logout"}
        </span>
      </div>
    </div>
  );
}
