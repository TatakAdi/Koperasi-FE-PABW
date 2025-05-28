import { SearchIcon } from "lucide-react";
import { usePathname } from "next/navigation";

export default function SearchBar({
  keyword,
  onKeywordChange,
  toggleKeywordSearch,
}) {
  const pathname = usePathname();
  return (
    <div className="relative">
      <input
        type="text"
        name=""
        id=""
        className="bg-[#F2F4F7] rounded-4xl w-[800px] font-normal text-base px-5 py-3"
        placeholder={
          pathname.startsWith("/Admin") ? "Cari aktor" : "Cari produk"
        }
        value={keyword}
        onChange={onKeywordChange}
      />
      <button
        type="button"
        onClick={toggleKeywordSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer px-2.5 py-3"
      >
        <SearchIcon />
      </button>
    </div>
  );
}
