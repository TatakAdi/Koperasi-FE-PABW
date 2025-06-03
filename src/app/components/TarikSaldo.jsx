// TarikSaldo.jsx
import { useEffect, useMemo, useRef, useState } from 'react';

const formatRupiah = (angka) => {
  if (angka === null || angka === undefined || isNaN(Number(angka))) return "Rp 0";
  return `Rp. ${Number(angka).toLocaleString('id-ID')}`;
};

export default function TarikSaldo({
  actorsList = [],
  initialJumlahPenarikan = 0,
  onKembali,
  onKonfirmasi,
}) {
  const [selectedActor, setSelectedActor] = useState(null);
  const [saldoSaatIniAnggota, setSaldoSaatIniAnggota] = useState(0);
  const [jumlahPenarikan, setJumlahPenarikan] = useState(String(initialJumlahPenarikan));

  const [isActorDropdownOpen, setIsActorDropdownOpen] = useState(false);
  const [actorSearchKeyword, setActorSearchKeyword] = useState("");
  const actorDropdownRef = useRef(null);
  const searchInputRef = useRef(null); // Ref untuk input pencarian

  useEffect(() => {
    if (selectedActor) {
      setSaldoSaatIniAnggota(selectedActor.saldo !== undefined ? Number(selectedActor.saldo) : 0);
      setJumlahPenarikan(String(initialJumlahPenarikan));
      setActorSearchKeyword(""); // Kosongkan keyword pencarian setelah memilih
    } else {
      setSaldoSaatIniAnggota(0);
      setJumlahPenarikan(String(initialJumlahPenarikan));
    }
  }, [selectedActor, initialJumlahPenarikan]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (actorDropdownRef.current && !actorDropdownRef.current.contains(event.target)) {
        setIsActorDropdownOpen(false);
        if (!selectedActor) { // Jika tidak ada aktor terpilih dan klik di luar, kosongkan keyword
            setActorSearchKeyword("");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedActor]); // Tambahkan selectedActor agar keyword bisa di-reset

  // Fokus ke input pencarian saat dropdown dibuka
  useEffect(() => {
    if (isActorDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isActorDropdownOpen]);


  const handleJumlahPenarikanChange = (event) => {
    const value = event.target.value.replace(/[^0-9]/g, '');
    setJumlahPenarikan(value);
  };

  const filteredActors = useMemo(() => {
    if (!actorSearchKeyword && !isActorDropdownOpen) { // Jangan filter jika dropdown tertutup & tidak ada keyword
        return actorsList; // Atau return [] jika tidak ingin menampilkan daftar saat keyword kosong & dropdown terbuka
    }
    const lowerKeyword = actorSearchKeyword.toLowerCase();
    return actorsList.filter(actor =>
      (actor.fullname && actor.fullname.toLowerCase().includes(lowerKeyword)) ||
      (actor.email && actor.email.toLowerCase().includes(lowerKeyword)) || // Bisa dihapus jika hanya nama
      (String(actor.id) === lowerKeyword)
    );
  }, [actorsList, actorSearchKeyword, isActorDropdownOpen]);


  const isMelebihiSaldo = Number(jumlahPenarikan) > saldoSaatIniAnggota;
  const formatDisplayJumlahPenarikan = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString('id-ID');
  };

  const handleSelectActor = (actor) => {
    setSelectedActor(actor);
    setIsActorDropdownOpen(false);
    // Keyword sudah di-reset di useEffect [selectedActor]
  };

  const handleConfirmClick = () => {
    if (!selectedActor) {
      alert("Silakan pilih anggota terlebih dahulu.");
      return;
    }
    if (Number(jumlahPenarikan) <= 0) {
      alert("Jumlah penarikan harus lebih dari 0.");
      return;
    }
    if (isMelebihiSaldo) {
      alert("Jumlah penarikan tidak boleh melebihi saldo anggota.");
      return;
    }
    onKonfirmasi(Number(jumlahPenarikan), selectedActor);
  };

  const handleDropdownButtonClick = () => {
    setIsActorDropdownOpen(prev => !prev);
    if (selectedActor && isActorDropdownOpen) { // Jika dropdown akan ditutup & ada aktor terpilih
        setActorSearchKeyword(""); // Reset search keyword
    } else if (!isActorDropdownOpen && !selectedActor) { // Jika dropdown akan dibuka & belum ada aktor terpilih
        setActorSearchKeyword(""); // Pastikan keyword kosong
    }
  };

  return (
    <div className="fixed inset-0 bg-white/40 flex justify-center items-center z-50 p-4">
      <div className="w-[480px] p-4 bg-white rounded-xl shadow-[-8px_0px_24px_16px_rgba(0,0,0,0.04)] inline-flex flex-col justify-center items-center overflow-hidden">
        <div className="self-stretch flex flex-col justify-center items-center gap-8 p-4">
          <div className="self-stretch justify-start text-neutral-900 text-lg font-medium font-['Geist'] leading-tight">Penarikan Saldo</div>
          
          <div className="self-stretch flex flex-col justify-start items-start gap-7 w-full">
            {/* Nama Anggota Dropdown & Search */}
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="justify-start text-[#3d3d3d] text-base font-medium font-['Geist'] leading-normal">Nama Anggota</div>
              <div className="relative w-full" ref={actorDropdownRef}>
                <div 
                  onClick={handleDropdownButtonClick}
                  className="self-stretch w-full h-12 pl-4 pr-3 py-3 bg-[#f2f4f7] rounded-xl outline-[1.50px] outline-gray-200 inline-flex justify-between items-center text-left cursor-pointer"
                >
                  {isActorDropdownOpen ? (
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Temukan nama anggota"
                      value={actorSearchKeyword}
                      onChange={(e) => {
                        setActorSearchKeyword(e.target.value);
                        if (selectedActor) setSelectedActor(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent text-neutral-900 placeholder-neutral-500 text-base font-normal font-['Geist'] leading-normal outline-none w-full"
                    />
                  ) : (
                    <div className="flex justify-start items-center gap-2 truncate w-full">
                      {selectedActor && selectedActor.profileImageUrl && (
                        <img className="size-6 rounded-full border border-gray-300 flex-shrink-0" src={selectedActor.profileImageUrl} alt="Avatar" />
                      )}
                      {!selectedActor && (
                          <div className="size-6 bg-gray-300 rounded-full border border-gray-300 flex-shrink-0"></div>
                      )}
                      <span className={`justify-start text-base font-medium font-['Geist'] leading-normal truncate ${selectedActor ? 'text-neutral-900' : 'text-neutral-500'}`}>
                        {selectedActor ? selectedActor.fullname : "Temukan nama anggota"}
                      </span>
                    </div>
                  )}
                  <div className={`size-6 relative overflow-hidden transition-transform duration-200 flex-shrink-0 ${isActorDropdownOpen ? 'rotate-180' : ''}`}>
                    <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                      <path d="M1 1L6 6L11 1" stroke="#272727" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>

                {isActorDropdownOpen && (
                  <div className="absolute mt-1 w-full bg-white rounded-xl shadow-lg z-10 border border-gray-200 max-h-60 flex flex-col overflow-hidden">
                    {/* Input pencarian sudah pindah ke atas */}
                    <div className="overflow-y-auto">
                      {filteredActors.length > 0 ? (
                        filteredActors.map(actor => (
                          <div
                            key={actor.id}
                            onClick={() => handleSelectActor(actor)}
                            className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3 text-sm" // Tambah gap-3
                          >
                            {actor.profileImageUrl ? (
                                 <img className="size-8 rounded-full border border-gray-300 flex-shrink-0" src={actor.profileImageUrl} alt={actor.fullname} /> // Perbesar avatar
                            ) : (
                                <div className="size-8 bg-gray-300 rounded-full border border-gray-300 flex items-center justify-center text-sm text-white flex-shrink-0"> {/* Perbesar avatar */}
                                    {actor.fullname ? actor.fullname.substring(0,1).toUpperCase() : 'N/A'}
                                </div>
                            )}
                            {/* Tampilkan hanya nama */}
                            <span className="text-neutral-800 font-medium">{actor.fullname}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          {actorSearchKeyword ? "Anggota tidak ditemukan." : (actorsList.length > 0 ? "Ketik untuk mencari anggota." : "Tidak ada anggota.")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detail Anggota Terpilih & Input Penarikan */}
            {selectedActor && (
              <>
                <div className="self-stretch flex flex-col justify-start items-start gap-[9px]">
                  <div className="flex flex-col justify-start items-start gap-1">
                    <div className="inline-flex justify-start items-center gap-2.5">
                      <div className="justify-start text-[#3d3d3d] text-base font-medium font-['Geist'] leading-normal">Jumlah Saldo Sukarela Saat Ini</div>
                    </div>
                  </div>
                  <div className="inline-flex justify-start items-center gap-2.5">
                    <div className="justify-start text-black text-[28px] font-semibold font-['Geist'] leading-normal">{formatRupiah(saldoSaatIniAnggota)}</div>
                  </div>
                </div>

                <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="justify-start text-[#3d3d3d] text-base font-medium font-['Geist'] leading-normal">Jumlah Penarikan Saldo</div>
                    <div className={`self-stretch h-12 pl-4 pr-3 py-3 bg-[#f2f4f7] rounded-xl outline-[1.50px] ${isMelebihiSaldo ? 'outline-red-500' : 'outline-gray-200'} inline-flex justify-start items-center gap-1`}>
                      <span className="justify-start text-neutral-900 text-base font-medium font-['Geist'] leading-normal">Rp</span>
                      <input 
                        type="text"
                        value={formatDisplayJumlahPenarikan(jumlahPenarikan)}
                        onChange={handleJumlahPenarikanChange}
                        className="bg-transparent text-neutral-900 text-base font-medium font-['Geist'] leading-normal outline-none w-full"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div className="justify-start text-[#808080] text-xs font-normal font-['Geist'] leading-normal">Catatan: Jumlah penarikan tidak bisa melebihi saldo anggota.</div>
                </div>
              </>
            )}
            {!selectedActor && (
                 <div className="self-stretch flex flex-col justify-start items-start gap-0.5 h-[160px]"> {/* Placeholder space */}
                    <div className="justify-start text-[#7f7f7f] text-sm font-normal font-['Geist'] leading-normal text-center w-full pt-8">
                        Pilih anggota untuk melihat detail saldo dan melakukan penarikan.
                    </div>
                </div>
            )}


          </div>

          {/* Tombol Aksi */}
          <div className="self-stretch inline-flex justify-start items-center gap-3 pt-4"> {/* Tambah pt-4 */}
            <button 
              onClick={onKembali}
              className="flex-1 h-10 px-2 bg-gray-100 rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] outline-1 outline-offset-[-1px] outline-gray-200 flex justify-center items-center gap-1 overflow-hidden cursor-pointer hover:bg-gray-200"
            >
              <div className="justify-start text-neutral-900 text-base font-medium font-['Geist'] leading-tight">Kembali</div>
            </button>
            <button 
              onClick={handleConfirmClick}
              disabled={!selectedActor || isMelebihiSaldo || Number(jumlahPenarikan) <= 0}
              className="flex-1 h-10 px-2 bg-black rounded-lg outline-1 outline-offset-[-1px] outline-black flex justify-center items-center gap-1 overflow-hidden cursor-pointer hover:bg-neutral-800 disabled:cursor-not-allowed"
            >
              <div className="px-2 flex justify-center items-center">
                <div className="justify-start text-white text-base font-medium font-['Geist'] leading-tight">Konfirmasi</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}