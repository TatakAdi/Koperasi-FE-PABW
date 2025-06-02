'use client';

import { getUserLogged } from "@/app/lib/api/login";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react"; // Impor useMemo

// Komponen Loading Overlay Sederhana
function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-[9999]">
      {/* Ganti dengan spinner atau animasi yang lebih baik jika perlu */}
      <div className="p-4 bg-gray-700 bg-opacity-80 text-white text-xl font-semibold rounded-lg shadow-lg">
        Loading...
      </div>
    </div>
  );
}

// Definisikan menu di luar komponen agar stabil dan tidak menyebabkan useMemo berjalan ulang tanpa perlu
const ALL_MENU_ITEMS = [
  {
    label: "Selling Statistics",
    icon: <img src="/statistic.svg" alt="statistic" className="size-6" />,
    href: "/Statistic",
    roles: ["admin", "pegawai","pengguna","penitip"], // Semua role yang terotentikasi
  },
  {
    label: "Sellings Data",
    icon: <img src="/carbon.svg" alt="sellings-data" className="size-6" />,
    href: "/Sellings",
    roles: ["admin", "pegawai", "pengguna", "penitip"], // Semua role yang terotentikasi
  },
  {
    label: "Product Management",
    icon: <img src="/carbon.svg" alt="carbon" className="size-6" />, // Pertimbangkan ikon berbeda jika ini untuk produk
    href: "/Product",
    roles: ["admin", "pegawai"], // Hanya admin dan pegawai
  },
  {
    label: "Actors",
    icon: <img src="/actor.svg" alt="actor" className="size-6" />,
    href: "/Actors",
    roles: ["admin"], // Hanya admin
  },
];


export default function SidebarAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null); // State untuk data pengguna yang login

  // Efek untuk mengambil data pengguna yang login
  useEffect(() => {
    const fetchUser = async () => {
      // Asumsi getUserLogged adalah fungsi yang mengembalikan { data: userObject } atau { error }
      // dan userObject memiliki properti 'tipe' (misal: 'admin', 'pegawai')
      const { data, error } = await getUserLogged(); // Anda perlu implementasi getUserLogged()
      if (data) {
        setAuthUser(data);
      } else {
        console.error("Gagal mendapatkan data pengguna:", error);
        setAuthUser(null); // Atau tangani error sesuai kebutuhan
      }
    };
    fetchUser();
  }, []);


  const handleNavigation = (href) => {
    if (pathname === href) {
      return;
    }
    setIsLoading(true);
    startTransition(() => {
      router.push(href);
    });
  };

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Filter menu berdasarkan peran pengguna menggunakan useMemo
  const visibleMenu = useMemo(() => {
    if (!authUser || !authUser.tipe) {
      // Jika pengguna belum login atau tipe pengguna tidak ada, tampilkan menu default
      // atau tidak sama sekali, tergantung kebutuhan.
      // Untuk contoh ini, kita tidak tampilkan menu yang butuh role spesifik.
      // Atau, jika ada item menu yang publik, bisa ditampilkan di sini.
      // Kita akan filter item yang 'roles' nya tidak kosong (membutuhkan role)
      // dan item yang roles-nya include 'public' atau semacamnya jika ada
      return ALL_MENU_ITEMS.filter(item => {
        // Jika item tidak mendefinisikan roles, anggap publik jika authUser ada (terotentikasi)
        // Atau jika ingin beberapa item selalu tampil bahkan tanpa login, tambahkan kondisi khusus.
        // Dalam kasus ini, semua item punya roles, jadi jika !authUser, array kosong.
        if (!authUser) return false; // Jangan tampilkan apa pun jika belum ada data user

        // Untuk item yang bisa diakses semua user terotentikasi (admin & pegawai dalam kasus ini)
        if (item.href === "/Statistic" || item.href === "/Sellings") {
            return true;
        }
        // Untuk item spesifik
        return item.roles && item.roles.includes(authUser.tipe);
      });
    }
    
    // Jika authUser dan authUser.tipe ada
    return ALL_MENU_ITEMS.filter(item => {
        // Untuk item "Selling Statistics" dan "Sellings Data", semua user terotentikasi bisa akses
        if ((item.href === "/Statistic" || item.href === "/Sellings") && authUser) {
            return true;
        }
        // Untuk item lain, cek berdasarkan roles yang didefinisikan
        return item.roles && item.roles.includes(authUser.tipe);
    });
  }, [authUser]);


  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="w-72 min-h-[936px] px-3 pt-3 pb-4 bg-gray-100 rounded-xl flex flex-col justify-start items-start gap-2.5">
        <div className="w-full flex flex-col gap-4">
          {/* Jika authUser belum termuat, bisa tampilkan skeleton/loading untuk menu */}
          {!authUser && !isLoading ? ( 
            <div className="p-2 text-stone-500">Memuat menu...</div>
          ) : (
            visibleMenu.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleNavigation(item.href)}
                  disabled={isLoading && pathname !== item.href}
                  className={`w-full px-2 py-1.5 rounded-lg flex items-center gap-2.5 transition cursor-pointer
                    ${isActive ? "bg-[#E3E7ED]" : "hover:bg-gray-200"}
                    ${
                      isLoading && pathname !== item.href
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    } 
                  `}
                >
                  {item.icon}
                  <span
                    className={`text-base font-medium font-[Geist] leading-normal
                      ${isActive ? "text-[#008A2E]" : "text-stone-500"}
                    `}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })
          )}
          {/* Tampilkan pesan jika tidak ada menu yang bisa ditampilkan setelah user terload */}
          {authUser && visibleMenu.length === 0 && !isLoading && (
             <div className="p-2 text-stone-500">Tidak ada menu yang tersedia untuk peran Anda.</div>
          )}
        </div>
      </div>
    </>
  );
}
