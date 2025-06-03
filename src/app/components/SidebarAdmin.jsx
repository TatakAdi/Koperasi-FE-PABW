"use client";

import { getUserLogged } from "@/app/lib/api/login";
import { usePathname, useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";

function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white opacity-40 flex items-center justify-center z-[9999]"> {/* Ubah background agar spinner lebih terlihat */}
      <div className="w-16 h-16 border-4 border-black border-t-transparent border-solid rounded-full animate-spin"></div>
    </div>
  );
}

const ALL_MENU_ITEMS = [
  {
    label: "Selling Statistics",
    icon: <img src="/statistic.svg" alt="statistic" className="size-6" />,
    href: "/Statistic",
    roles: ["admin","pengguna", "penitip"],
  },
  {
    label: "Sellings Statistics",
    icon: <img src="/statistic.svg" alt="sellings-data" className="size-6" />,
    href: "/Sellings",
    roles: ["pegawai"],
  },
  {
    label: "Product Management",
    icon: <img src="/carbon.svg" alt="carbon" className="size-6" />,
    href: "/Product",
    roles: ["admin", "pegawai"],
  },
  {
    label: "Product Setup",
    icon: <img src="/carbon.svg" alt="carbon" className="size-6"/>,
    href: "/MyProduct",
    roles: ["pengguna", "penitip"],
    },
  {
    label: "Actors",
    icon: <img src="/actor.svg" alt="actor" className="size-6" />,
    href: "/Actors",
    roles: ["admin"],
  },
];

export default function SidebarAdmin() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [authUser, setAuthUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await getUserLogged();
      if (data) {
        setAuthUser(data);
      } else {
        console.error("Gagal mendapatkan data pengguna:", error);
        setAuthUser(null);
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
  }, [pathname]);

  const visibleMenu = useMemo(() => {
    if (!authUser || !authUser.tipe) {
      return ALL_MENU_ITEMS.filter((item) => {
        if (!authUser) return false;


        return item.roles && item.roles.includes(authUser.tipe);
      });
    }

    return ALL_MENU_ITEMS.filter((item) => {
      return item.roles && item.roles.includes(authUser.tipe);
    });
  }, [authUser]);

  return (
    <>
      {isLoading && <LoadingOverlay />}
      <div className="w-72 min-h-[936px] px-3 pt-3 pb-4 bg-gray-100 rounded-xl flex flex-col justify-start items-start gap-2.5 ml-[20px]">
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
            <div className="p-2 text-stone-500">
              Tidak ada menu yang tersedia untuk peran Anda.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
