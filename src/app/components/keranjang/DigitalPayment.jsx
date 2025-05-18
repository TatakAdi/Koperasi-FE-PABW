'use client';
import { useEffect, useState } from 'react';

export default function DigitalPayment({ total, onConfirm, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
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

  const handleSelect = (method) => {
    setSelected(prev => (prev === method ? '' : method));
  };

  const renderBankTransferDetail = (name, accountNumber, logoPath) => (
    <div className="mt-4">
      {/* <h3 className="text-md font-semibold mb-2">Transfer Bank {name}</h3>
      <img src={logoPath} alt={name} className="h-10 mb-4 mx-auto" /> */}
      <div>
        <p className="text-sm font-medium">Nomor Rekening</p>
        <div className="bg-gray-100 rounded-md px-4 py-2 text-center font-mono text-lg mb-4">
          {accountNumber}
        </div>
        <p className="text-sm font-medium mb-1">Petunjuk Pembayaran:</p>
        <div className="bg-gray-100 rounded-md px-4 py-2 text-xs leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1">
            <li>Buka app mobile banking anda.</li>
            <li>Pilih menu <strong>Transfer</strong></li>
            <li>Pilih <strong>Bank Tujuan</strong></li>
            <li>Masukkan <strong>nomor rekening</strong></li>
            <li>Cek apakah <strong>nama penerima</strong> sesuai</li>
            <li>
              Masukkan <strong>jumlah pembayaran</strong> sesuai dengan nilai transaksi
              (pastikan 3 digit belakang nilai transaksi sesuai agar terverifikasi).
            </li>
          </ol>
        </div>
      </div>
    </div>
  );

  if (expired) {
    return (
      <div className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
        style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}>
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col items-center border-2 border-black-500">
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

          {/* QRIS */}
          {(selected === '' || selected === 'qris') && (
            <div>
              <p className="text-xs text-gray-500 mb-1">QRIS</p>
              <button
                className={`flex items-center rounded-lg border transition ${selected === 'qris' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => handleSelect('qris')}
              >
                <img src="/QRIS.svg" alt="QRIS" className="h-8" />
              </button>
            </div>
          )}

          {selected === 'qris' && (
            <div className="mt-4 rounded-xl p-4 space-y-4 text-sm bg-white ">
              <div className="flex justify-center">
                <img src="/QRCODE.svg" alt="Kode QR" className="h-40 w-40 object-contain" />
              </div>

              <div>
                <p className="font-semibold text-">Keterangan Toko:</p>
                <div className="bg-gray-100 rounded-md px-4 py-3 space-y-1 text-sm">
                  <p className="font-semibold">Koperasi ITK</p>
                  <p className="text-gray-500"> Gedung A, Kampus ITK, Karang Joang, Balikpapan Barat, Balikpapan.</p>
                  <p className="text-sm font-semibold">NMID: ID1234567890</p>
                </div>
              </div>
            </div>
          )}

          {/* GOPAY */}
          {(selected === '' || selected === 'gopay') && (
            <div>
              <p className="text-xs text-gray-500 mb-1">GOPAY</p>
              <button
                className={`flex items-center rounded-lg border transition ${selected === 'gopay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => handleSelect('gopay')}
              >
                <img src="/Gopay.svg" alt="GOPAY" className="h-8" />
              </button>
              {/* {selected === 'gopay' && (
                <div className="mt-2 flex flex-col items-center">
                  <p className="text-sm font-medium">GOPAY</p>
                  <img src="/QRCODE.svg" alt="Gopay Payment" className="h-40 w-40 object-contain" />
                  <span className="text-xs text-gray-500 mt-1">Scan kode QR atau transfer ke 0812-xxxx-xxxx (Gopay).</span>
                </div>
              )} */}
            </div>
          )}

          {selected === 'gopay' && (
            <div className="mt-4 rounded-xl p-4 space-y-4 text-sm bg-white ">
              <div className="flex justify-center">
                <img src="/QRCODE.svg" alt="Kode QR" className="h-40 w-40 object-contain" />
              </div>

              <div>
                <p className="font-semibold text-">No. Telepon GOPAY</p>
                <div className="bg-gray-100 rounded-md px-4 py-3 space-y-1 text-sm">
                  <p className="font-semibold">+6281234567890</p>
                </div>
              </div>
            </div>
          )}

          {/* VA Bank */}
          {(selected === '' || ['bni', 'mandiri', 'bri'].includes(selected)) && (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">VA Bank</p>
                <div className="flex gap-3 items-center">
                  {['bni', 'mandiri', 'bri'].map((bank) => (
                    <button
                      key={bank}
                      className={`rounded-lg border p-1 transition ${selected === bank ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                      onClick={() => handleSelect(bank)}
                    >
                      <img src={`/${bank.toUpperCase()}.svg`} alt={bank.toUpperCase()} className="h-10" />
                    </button>
                  ))}
                </div>
              </div>
              {['mandiri'].includes(selected) && (
                <div className="space-y-4 text-sm rounded-lg p-4 bg-white">
                  <div>
                    <p className="text-sm font-medium">Company Code</p>
                    <div className="bg-gray-100 rounded-md px-4 py-2 text-center font-mono text-lg mb-2">
                      {selected === 'mandiri' && '70012'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nomor VA {selected.toUpperCase()}</p>
                    <div className="bg-gray-100 rounded-md px-4 py-2 text-center font-mono text-lg mb-2">
                      {selected === 'mandiri' && '9876543210'}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium mb-1">Petunjuk Pembayaran:</p>
                    <div className="bg-gray-200 rounded-md px-4 py-2 text-xs leading-relaxed">
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Buka app <strong>Livin' by Mandiri</strong> anda.</li>
                        <li>Pilih menu <strong>Transfer</strong> atau <strong>Bank Transfer</strong>.</li>
                        <li>Pilih <strong>e-commerce</strong>.</li>
                        <li>Pilih <strong>Midtrans</strong> atau masukkan kode <strong>70012</strong>.</li>
                        <li>Masukkan <strong>nomor VA</strong> sesuai pada kolom di atas.</li>
                        <li>Masukkan nominal transfer yang sesuai.</li>
                        <li>Konfirmasi dan pembayaran selesai.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {['bni'].includes(selected) && (
                <div className="space-y-4 text-sm rounded-lg p-4 bg-white">
                  <div>
                    <p className="text-sm font-medium">Nomor VA {selected.toUpperCase()}</p>
                    <div className="bg-gray-100 rounded-md px-4 py-2 text-center font-mono text-lg mb-2">
                      {selected === 'bni' && '1234567890'}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium mb-1">Petunjuk Pembayaran:</p>
                    <div className="bg-gray-200 rounded-md px-4 py-2 text-xs leading-relaxed">
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Buka app <strong>BNI</strong> mobile banking anda.</li>
                        <li>Pilih menu <strong>Transfer</strong>.</li>
                        <li>Pilih <strong>Virtual Account Billing</strong>.</li>
                        <li>Pilih <strong>Akun Debit</strong> yang ingin digunakan.</li>
                        <li>Masukkan <strong>nomor VA</strong> sesuai pada kolom di atas.</li>
                        <li>Masukkan nominal transfer yang sesuai.</li>
                        <li>Konfirmasi dan pembayaran selesai.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {['bri'].includes(selected) && (
                <div className="space-y-4 text-sm rounded-lg p-4 bg-white">
                  <div>
                    <p className="text-sm font-medium">Nomor VA {selected.toUpperCase()}</p>
                    <div className="bg-gray-100 rounded-md px-4 py-2 text-center font-mono text-lg mb-2">
                      {selected === 'bri' && '1122334455'}
                    </div>
                  </div>

                  <div className="text-sm">
                    <p className="font-medium mb-1">Petunjuk Pembayaran:</p>
                    <div className="bg-gray-200 rounded-md px-4 py-2 text-xs leading-relaxed">
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Buka app <strong>BRIMO</strong> anda.</li>
                        <li>Pilih menu <strong>Pembayaran</strong>.</li>
                        <li>Pilih <strong>BRIVA</strong>.</li>
                        <li>Masukkan <strong>nomor VA</strong> sesuai pada kolom di atas.</li>
                        <li>Masukkan nominal transfer yang sesuai.</li>
                        <li>Konfirmasi dan pembayaran selesai.</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bank Transfer */}
          {(selected === '' || ['bni-tf', 'mandiri-tf', 'bri-tf', 'bca'].includes(selected)) && (
            <div>
              <p className="text-xs text-gray-500 mb-1">Bank Transfer</p>
              <div className="flex gap-3 items-center">
                {['bni-tf', 'mandiri-tf', 'bri-tf', 'bca'].map((bank) => (
                  <button
                    key={bank}
                    className={`rounded-lg border p-1 transition ${selected === bank ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                    onClick={() => handleSelect(bank)}
                  >
                    <img src={`/${bank.split('-')[0].toUpperCase()}.svg`} alt={bank.toUpperCase()} className="h-10" />
                  </button>
                ))}
              </div>
              {selected === 'bni-tf' &&
                renderBankTransferDetail('BNI', '1234567890', '/BNI.svg')}
              {selected === 'mandiri-tf' &&
                renderBankTransferDetail('Mandiri', '9876543210', '/Mandiri.svg')}
              {selected === 'bri-tf' &&
                renderBankTransferDetail('BRI', '1122334455', '/BRI.svg')}
              {selected === 'bca' &&
                renderBankTransferDetail('BCA', '5566778899', '/BCA.svg')}
            </div>
          )}
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