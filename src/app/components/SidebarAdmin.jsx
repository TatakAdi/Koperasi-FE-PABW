import React from "react";
import { useRouter } from "next/navigation";

export default function SidebarAdmin() {
  const router = useRouter();

  return (
    <div className="w-72 min-h-[936px] px-3 pt-3 pb-4 bg-gray-100 rounded-xl flex flex-col justify-start items-start gap-2.5 overflow-hidden">
      <div className="w-full flex flex-col gap-4">
        {/* Selling Statistics */}
        <button
          type="button"
          onClick={() => router.push("/Statistic")}
          className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-300 transition"
        >
          <img src="/statistic.svg" alt="statistic" className="size-6" />
          <img src="/carbon.svg" alt="carbon" className="size-6" />
          <span className="text-stone-500 text-base font-medium font-[Geist] leading-normal">
            Selling Statistics
          </span>
        </button>
        {/* Product Management */}
        <button
          type="button"
          onClick={() => router.push("/Product")}
          className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-200 transition"
        >
          <img src="/carbon.svg" alt="carbon" className="size-6" />
          <span className="text-stone-500 text-base font-medium font-[Geist] leading-normal">
            Product Management
          </span>
        </button>
        {/* Actors */}
        <button
          type="button"
          onClick={() => router.push("/Actors")}
          className="w-full px-2 py-1.5 rounded-lg flex items-center gap-2.5 hover:bg-gray-200 transition"
        >
          <img src="/actor.svg" alt="actor" className="size-6" />
          <span className="text-stone-500 text-base font-medium font-[Geist] leading-normal">
            Actors
          </span>
        </button>
      </div>
    </div>
  );
}