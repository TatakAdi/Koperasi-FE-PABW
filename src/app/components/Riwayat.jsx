export default function Riwayat({
  totalTransaksi,
  totalPenjualan,
  totalPengiriman,
}) {
  return (
    <div className="w-full flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-4">
      {/* Card: Total Transaksi */}
      <div className="flex-1 min-w-[280px] max-w-xs p-4 bg-white rounded-xl  outline-1 outline-offset-[-1px] outline-stroke-4 flex flex-col gap-2.5 overflow-hidden outline-[#D0D0D0]">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <div className="text-[#737373] text-base font-medium font-[Geist]">
                Total Transaksi
              </div>
            </div>
          </div>
          <div className="flex gap-16 w-full">
            <div className="flex gap-3 items-end">
              <div className="flex items-center gap-2.5">
                {/* Menampilkan totalTransaksi dari props */}
                <div className="text-PRIMARY-1 text-3xl font-medium font-[Geist] leading-9">
                  {totalTransaksi !== undefined ? totalTransaksi : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Total Penjualan (Unit) */}
      <div className="flex-1 min-w-[280px] max-w-xs p-4 bg-white rounded-xl  outline-1 outline-offset-[-1px] outline-stroke-4 flex flex-col justify-end items-start gap-2.5 overflow-hidden outline-[#D0D0D0]">
        <div className="flex flex-col justify-end gap-6 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <div className="text-[#737373] text-base font-medium font-[Geist]">
                Total Penjualan
              </div>
            </div>
          </div>
          <div className="flex justify-start items-start gap-16 w-full">
            <div className="flex justify-start items-end gap-3">
              <div className="flex justify-center items-center gap-2.5">
                {/* Menampilkan totalPenjualan dari props */}
                <div className="text-PRIMARY-1 text-3xl font-medium font-[Geist] leading-9">
                  {totalPenjualan !== undefined ? totalPenjualan : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card: Total Pengiriman */}
      <div className="flex-1 min-w-[280px] max-w-xs p-4 bg-white rounded-xl outline-1 outline-offset-[-1px] outline-stroke-4 flex flex-col gap-2.5 overflow-hidden outline-[#D0D0D0]">
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="flex justify-between items-center w-full">
            {" "}
            {/* Menggunakan justify-between untuk konsistensi */}
            <div className="flex items-center gap-2.5">
              <div className="text-[#737373] text-base font-medium font-[Geist]">
                Total Pengiriman
              </div>
            </div>
          </div>
          <div className="h-9 flex justify-start items-end gap-3">
            {" "}
            {/* Disesuaikan dengan items-end */}
            <div className="flex justify-start items-end gap-3">
              {" "}
              {/* Dihapus w-20 agar lebih fleksibel */}
              <div className="flex justify-center items-center gap-2.5">
                {/* Menampilkan totalPengiriman dari props */}
                <div className="text-PRIMARY-1 text-3xl font-medium font-[Geist] leading-9">
                  {totalPengiriman !== undefined ? totalPengiriman : 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
