
export default function Riwayat() {
  return (
    <div className="flex flex-row gap-4">
      {/* Card: Total Transaksi */}
      <div className="w-80 p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-stroke-4 flex flex-col gap-2.5 overflow-hidden outline-[#D0D0D0]">
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <div className="text-foreground-9 text-base font-medium font-[Geist]">Total Transaksi</div>
            </div>
            <div className="w-24 pl-2 pr-1 py-1 bg-white rounded-lg outline outline-1 outline-black/20 flex items-center gap-1 overflow-hidden">
              <div className="flex-1 flex items-center justify-between">
                <span className="whitespace-nowrap text-foreground-7 text-sm font-medium font-[Geist] leading-tight">All Time</span>
                <div className="w-0 px-[3px] py-1.5 origin-top-left -rotate-90 flex flex-col gap-2.5 overflow-hidden">
                  <div className="w-3 h-5 bg-foreground-7" />
                </div>
                <img src="/Frame.svg" alt="frame" className="size-5 ml-2" />
              </div>
            </div>
          </div>
          <div className="flex gap-16 w-full">
            <div className="flex gap-3 items-end">
              <div className="flex items-center gap-2.5">
                <div className="text-PRIMARY-1 text-3xl font-medium font-[Geist] leading-9">12</div>
              </div>
              <div className="w-7 flex items-center gap-2.5">
                <div className="text-foreground-5 text-base font-normal font-[Geist] leading-normal">+1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card: Total Pengiriman (Monthly) */}
      <div className="w-80 p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-stroke-4 flex flex-col justify-end items-start gap-2.5 overflow-hidden outline-[#D0D0D0]">
        <div className="flex flex-col justify-end gap-6 w-full">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5">
              <div className="text-foreground-9 text-base font-medium font-[Geist]">Total Pengiriman</div>
            </div>
            <div className="w-24 pl-2 pr-1 py-1 bg-white rounded-lg outline outline-1 outline-black/20 flex items-center gap-1 overflow-hidden">
              <div className="flex-1 flex items-center justify-between">
                <span className="whitespace-nowrap text-foreground-7 text-sm font-medium font-[Geist] leading-tight">Monthly</span>
                <div className="w-0 px-[3px] py-1.5 origin-top-left -rotate-90 flex flex-col gap-2.5 overflow-hidden">
                  <div className="w-3 h-5 bg-foreground-7" />
                </div>
                <img src="/Frame.svg" alt="frame" className="size-5 ml-2" />
              </div>
            </div>
          </div>
          <div className="flex justify-start items-start gap-16 w-full">
            <div className="flex justify-start items-end gap-3">
              <div className="flex justify-center items-center gap-2.5">
                <div className="text-PRIMARY-1 text-3xl font-medium font-[Geist] leading-9">420</div>
              </div>
              <div className="w-7 flex justify-center items-center gap-2.5">
                <div className="text-foreground-5 text-base font-normal font-[Geist] leading-normal">+37</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Card: Total Pengiriman (Daily) */}
      <div className="w-80 p-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-stroke-4 flex flex-col gap-2.5 overflow-hidden outline-[#D0D0D0]">
        <div className="flex flex-col gap-6 items-start w-full">
          <div className="flex justify-start items-center gap-28 w-full">
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="text-foreground-9 text-base font-medium font-[Geist]">Total Pengiriman</div>
              </div>
              <div className="w-24 pl-2 pr-1 py-1 bg-white rounded-lg outline outline-1 outline-black/20 flex items-center gap-1 overflow-hidden">
                <div className="flex-1 flex items-center justify-between">
                  <span className="whitespace-nowrap text-foreground-7 text-sm font-medium font-[Geist] leading-tight">Daily</span>
                  <div className="w-0 px-[3px] py-1.5 origin-top-left -rotate-90 flex flex-col gap-2.5 overflow-hidden">
                    <div className="w-3 h-5 bg-foreground-7" />
                  </div>
                  <img src="/Frame.svg" alt="frame" className="size-5 ml-2" />
                </div>
              </div>
            </div>
          </div>
          <div className="h-9 flex justify-start items-start gap-3">
            <div className="w-20 flex justify-start items-end gap-3">
              <div className="flex justify-center items-center gap-2.5">
                <div className="text-PRIMARY-1 text-3xl font-medium font-[Geist] leading-9">12</div>
              </div>
              <div className="w-7 flex justify-center items-center gap-2.5">
                <div className="text-foreground-5 text-base font-medium font-[Geist] leading-normal">+1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}