
export default function Kategori({ value, className = "" }) {
  if (value === "Makanan Berat") {
    return (
      <div className={`px-1.5 py-0.5 bg-purple-100 rounded-lg inline-flex justify-center items-center gap-2.5 ${className}`}>
        <div className="flex justify-start items-center gap-1">
          <img src="/makanan berat.svg" alt="Makanan Berat" className="size-4" />
          <span className="text-violet-700 text-base font-medium font-[Geist] leading-normal">Makanan Berat</span>
        </div>
      </div>
    );
  }
  if (value === "Minuman") {
    return (
      <div className={`px-1.5 py-0.5 bg-cyan-100 rounded-lg outline-offset-[-1px] inline-flex justify-center items-center gap-1 ${className}`}>
        <div className="flex justify-start items-center gap-1">
          <img src="/minuman.svg" alt="Minuman" className="size-4" />
          <span className="text-sky-700 text-base font-medium font-[Geist] leading-normal">Minuman</span>
        </div>
      </div>
    );
  }
  if (value === "Makanan Ringan") {
    return (
      <div className={`px-1.5 py-0.5 bg-[#EBFAEB] rounded-lg inline-flex justify-center items-center gap-1 ${className}`}>
        <div className="flex justify-start items-center gap-1">
          <img src="/makanan ringan.svg" alt="Makanan Ringan" className="size-4" />
          <span className="text-[#297A3A] text-base font-medium font-[Geist] leading-normal">Makanan Ringan</span>
        </div>
      </div>
    );
  }
  return null;
}