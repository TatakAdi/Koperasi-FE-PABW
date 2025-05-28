import { usePathname, useRouter } from "next/navigation";

export default function SidebarAdmin() {
  const router = useRouter();
  const pathname = usePathname();

  // Helper for active state
  const menu = [
    {
      label: "Selling Statistics",
      icon: (
        <>
          <img src="/statistic.svg" alt="statistic" className="size-6" />
        </>
      ),
      href: "/Admin/Statistic",
    },
    {
      label: "Product Management",
      icon: <img src="/carbon.svg" alt="carbon" className="size-6" />,
      href: "/Admin/Product",
    },
    {
      label: "Actors",
      icon: <img src="/actor.svg" alt="actor" className="size-6" />,
      href: "/Admin/Actors",
    },
  ];

  return (
    <div className="w-72 min-h-[936px] px-3 pt-3 pb-4 bg-gray-100 rounded-xl flex flex-col justify-start items-start gap-2.5">
      <div className="w-full flex flex-col gap-4">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => router.push(item.href)}
              className={`w-full px-2 py-1.5 rounded-lg flex items-center gap-2.5 transition
                ${isActive ? "bg-[#E3E7ED]" : "hover:bg-gray-200"}
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
        })}
      </div>
    </div>
  );
}