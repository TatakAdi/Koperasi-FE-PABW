'use client';
import { useEffect, useState } from 'react';

export default function DigitalPayment({ total, onConfirm, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 menit
  const [selected, setSelected] = useState('');
  const [expired, setExpired] = useState(false);
  
  useEffect(() => {
    if (timeLeft === 0) {
      setExpired(true);
      setTimeout(() => {
        onCancel && onCancel();
      }, 2000);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onCancel]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

 if (expired) {
  return (
    <div className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}>
      <div
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col items-center border-2 border-black-500"
      >
        <span className="text-red-600 text-lg font-semibold mb-2">Waktu habis</span>
        <span className="text-gray-700 text-base mb-4">Pembayaran dibatalkan</span>
      </div>
    </div>
  );
}

  return (
    <div
      className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Selesaikan Pembayaran</h2>

        <div className="flex justify-between text-base">
          <span>Total</span>
          <span className="font-bold text-lg">Rp. {total.toLocaleString('id-ID')}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Waktu tersisa:</span>
          <span className="text-red-500 font-semibold">{formatTime(timeLeft)}</span>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <p className="font-medium">Pilih metode pembayaran:</p>

          <div>
            <p className="text-xs text-gray-500 mb-1">QRIS</p>
            <button
              className={`flex items-center rounded-lg border transition ${selected === 'qris' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
              onClick={() => setSelected('qris')}
            >
              <img src="/QRIS.svg" alt="QRIS" className="h-8" />
            </button>
            {selected === 'qris' && (
              <div className="mt-2 flex flex-col items-center">
                <img src="/QRCODE.svg" alt="Kode QR" className="h-40 w-40 object-contain" />
                <span className="text-xs text-gray-500 mt-1">Scan kode QR di atas untuk membayar dengan QRIS.</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">GOPAY</p>
            <button
              className={`flex items-center rounded-lg border transition ${selected === 'gopay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
              onClick={() => setSelected('gopay')}
            >
              <img src="/Gopay.svg" alt="GOPAY" className="h-8" />
            </button>
            {selected === 'gopay' && (
              <div className="mt-2 flex flex-col items-center">
                <img src="/QRCODE.svg" alt="Gopay Payment" className="h-40 w-40 object-contain" />
                <span className="text-xs text-gray-500 mt-1">Scan kode QR atau transfer ke 0812-xxxx-xxxx (Gopay).</span>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">VA Bank</p>
            <div className="flex gap-3 items-center">
              <button
                className={`rounded-lg border p-1 transition ${selected === 'bni' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('bni')}
              >
                <img src="/BNI.svg" alt="BNI" className="h-4" />
              </button>
              <button
                className={`rounded-lg border p-1 transition ${selected === 'mandiri' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('mandiri')}
              >
                <img src="/Mandiri.svg" alt="Mandiri" className="h-13" />
              </button>
              <button
                className={`rounded-lg border p-1 transition ${selected === 'bri' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('bri')}
              >
                <img src="/BRI.svg" alt="BRI" className="h-10" />
              </button>
            </div>
            {selected === 'bni' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening BNI:</span>
                <div className="text-lg font-mono">1234567890</div>
              </div>
            )}
            {selected === 'mandiri' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening Mandiri:</span>
                <div className="text-lg font-mono">9876543210</div>
              </div>
            )}
            {selected === 'bri' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening BRI:</span>
                <div className="text-lg font-mono">1122334455</div>
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-1">Bank Transfer</p>
            <div className="flex gap-3 items-center">
              <button
                className={`rounded-lg border p-1 transition ${selected === 'bni-tf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('bni-tf')}
              >
                <img src="/BNI.svg" alt="BNI" className="h-4" />
              </button>
              <button
                className={`rounded-lg border p-1 transition ${selected === 'mandiri-tf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('mandiri-tf')}
              >
                <img src="/Mandiri.svg" alt="Mandiri" className="h-13" />
              </button>
              <button
                className={`rounded-lg border p-1 transition ${selected === 'bri-tf' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('bri-tf')}
              >
                <img src="/BRI.svg" alt="BRI" className="h-10" />
              </button>
              <button
                className={`rounded-lg border p-1 transition ${selected === 'bca' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => setSelected('bca')}
              >
                <img src="/BCA.svg" alt="BCA" className="h-10" />
              </button>
            </div>
            {selected === 'bni-tf' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening BNI:</span>
                <div className="text-lg font-mono">1234567890</div>
              </div>
            )}
            {selected === 'mandiri-tf' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening Mandiri:</span>
                <div className="text-lg font-mono">9876543210</div>
              </div>
            )}
            {selected === 'bri-tf' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening BRI:</span>
                <div className="text-lg font-mono">1122334455</div>
              </div>
            )}
            {selected === 'bca' && (
              <div className="mt-2 text-center">
                <span className="font-semibold">No. Rekening BCA:</span>
                <div className="text-lg font-mono">5566778899</div>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-gray-400 pt-2">Segera selesaikan pembayaran sebelum waktu habis.</p>

        <div className="flex justify-between gap-3 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-100 transition"
          >
            Kembali
          </button>
          <button
            onClick={onConfirm}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}