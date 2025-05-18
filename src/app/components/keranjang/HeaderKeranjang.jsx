import Image from "next/image";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeaderKeranjang({ search, setSearch }) {
  const router = useRouter();

  return (
    <header className="w-full bg-white shadow-none py-3 px-6 flex items-center justify-between">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src="/Logo.svg" alt="Logo" width={40} height={40} />
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-5 h-5" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xl">🛒</span>
        <span className="text-xl">🔔</span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-purple-500"></div>
      </div>
    </header>
  );
}
