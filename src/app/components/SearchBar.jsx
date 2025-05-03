import { SearchIcon } from "lucide-react";

export default function SearchBar({
  keyword,
  onKeywordChange,
  toggleKeywordSearch,
}) {
  return (
    <div className="relative">
      <input
        type="text"
        name=""
        id=""
        className="bg-[#F2F4F7] rounded-4xl w-[800px] font-normal text-base px-5 py-3"
        placeholder="Cari Produk"
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
