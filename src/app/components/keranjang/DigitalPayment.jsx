"use client";
import { useEffect, useState } from "react";

export default function DigitalPayment({
  total,
  cartId,
  onConfirm,
  onCancel,
  userId,
  items,
}) {
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [selected, setSelected] = useState("");
  const [expired, setExpired] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);

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
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleSelect = (method) => {
    setSelected((prev) => (prev === method ? "" : method));
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setLoading(true);
    let payload = { cart_id: cartId };
    if (selected === "qris") {
      payload.payment_method = "qris";
    } else if (["bni", "bri"].includes(selected)) {
      payload.payment_method = "bank";
      payload.bank = selected;
    }
    try {
      const res = await fetch("/api/proxy/getPaymentData", {
        // use your proxy
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setPaymentData(data.data); // or setPaymentData(data.result) if that's the structure
      if (onConfirm) onConfirm(data);
    } catch (err) {
      alert("Gagal memulai pembayaran");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckPaymentStatus = async (orderId) => {
    setLoading(true);
    try {
      const res = await fetch("/api/proxy/getPaymentResult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const data = await res.json();
      // Handle the result as needed (show status, redirect, etc)
      alert(`Status pembayaran: ${data.status || JSON.stringify(data)}`);
    } catch (err) {
      alert("Gagal memeriksa status pembayaran");
    } finally {
      setLoading(false);
    }
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
            <li>
              Pilih menu <strong>Transfer</strong>
            </li>
            <li>
              Pilih <strong>Bank Tujuan</strong>
            </li>
            <li>
              Masukkan <strong>nomor rekening</strong>
            </li>
            <li>
              Cek apakah <strong>nama penerima</strong> sesuai
            </li>
            <li>
              Masukkan <strong>jumlah pembayaran</strong> sesuai dengan nilai
              transaksi (pastikan 3 digit belakang nilai transaksi sesuai agar
              terverifikasi).
            </li>
          </ol>
        </div>
      </div>
    </div>
  );

  const renderQrisResult = () => {
    console.log("renderQrisResult paymentData:", paymentData);
    return (
      <div className="mt-4 rounded-xl p-4 space-y-4 text-sm bg-white ">
        <div className="flex justify-center">
          {paymentData?.payment_url ? (
            <img
              src={paymentData.payment_url}
              alt="Kode QR"
              className="h-40 w-40 object-contain"
            />
          ) : (
            <span>QR tidak tersedia</span>
          )}
        </div>
        <div>
          <p className="font-semibold">Order ID:</p>
          <div className="bg-gray-100 rounded-md px-4 py-3 text-sm">
            {paymentData?.order_id}
          </div>
        </div>
      </div>
    );
  };

  const renderVaResult = () => (
    <div className="mt-4 rounded-xl p-4 space-y-4 text-sm bg-white ">
      <div>
        <p className="font-semibold">
          Virtual Account {paymentData?.extra?.bank?.toUpperCase()}
        </p>
        <div className="bg-gray-100 rounded-md px-4 py-3 text-lg font-mono">
          {paymentData?.extra?.va_number}
        </div>
      </div>
      <div>
        <p className="font-semibold">Order ID:</p>
        <div className="bg-gray-100 rounded-md px-4 py-3 text-sm">
          {paymentData?.order_id}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const fetchPayment = async () => {
      setLoading(true);
      let payload;
      if (selected === "qris") {
        payload = { cart_id: userId, payment_method: "qris" };
      } else if (["bni", "bri"].includes(selected)) {
        payload = { cart_id: userId, payment_method: "bank", bank: selected };
      } else {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/proxy/getPaymentData", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        setPaymentData(data);
      } catch (err) {
        alert("Gagal memulai pembayaran");
      } finally {
        setLoading(false);
      }
    };

    if (
      (selected === "qris" || ["bni", "bri"].includes(selected)) &&
      !paymentData
    ) {
      fetchPayment();
    }
  }, [selected, userId, paymentData]);

  console.log("paymentData", paymentData);

  if (expired) {
    return (
      <div
        className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
        style={{
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
      >
        <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md flex flex-col items-center border-2 border-black-500">
          <span className="text-red-600 text-lg font-semibold mb-2">
            Waktu habis
          </span>
          <span className="text-gray-700 text-base mb-4">
            Pembayaran dibatalkan
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)" }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Selesaikan Pembayaran</h2>

        <div className="flex justify-between text-base">
          <span>Total</span>
          <span className="font-bold text-lg">
            Rp. {total.toLocaleString("id-ID")}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span>Waktu tersisa:</span>
          <span className="text-red-500 font-semibold">
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <p className="font-medium">Pilih metode pembayaran:</p>

          {/* QRIS */}
          {(selected === "" || selected === "qris") && !paymentData && (
            <div>
              <p className="text-xs text-gray-500 mb-1">QRIS</p>
              <button
                className={`flex items-center rounded-lg border transition ${
                  selected === "qris"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-white"
                }`}
                onClick={() => setSelected("qris")}
              >
                <img src="/QRIS.svg" alt="QRIS" className="h-8" />
              </button>
            </div>
          )}

          {selected === "qris" && paymentData && renderQrisResult()}

          {/* VA Bank */}
          {(selected === "" || ["bni", "bri"].includes(selected)) &&
            !paymentData && (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">VA Bank</p>
                  <div className="flex gap-3 items-center">
                    {["bni", "bri"].map((bank) => (
                      <button
                        key={bank}
                        className={`rounded-lg border p-1 transition ${
                          selected === bank
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white"
                        }`}
                        onClick={() => setSelected(bank)}
                      >
                        <img
                          src={`/${bank.toUpperCase()}.svg`}
                          alt={bank.toUpperCase()}
                          className="h-10"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          {["bni", "bri"].includes(selected) && paymentData && renderVaResult()}

          {/* GOPAY */}
          {/*
          (selected === '' || selected === 'gopay') && (
            <div>
              <p className="text-xs text-gray-500 mb-1">GOPAY</p>
              <button
                className={`flex items-center rounded-lg border transition ${selected === 'gopay' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}`}
                onClick={() => handleSelect('gopay')}
              >
                <img src="/Gopay.svg" alt="GOPAY" className="h-8" />
              </button>
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
          */}

          {/* Bank Transfer */}
          {/* {(selected === '' || ['bni-tf', 'mandiri-tf', 'bri-tf', 'bca'].includes(selected)) && (
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
          )} */}
        </div>

        <p className="text-xs text-center text-gray-400 pt-2">
          Segera selesaikan pembayaran sebelum waktu habis.
        </p>

        <div className="flex justify-between gap-3 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-100 transition"
            disabled={loading}
          >
            Kembali
          </button>
          <button
            onClick={() => handleCheckPaymentStatus(paymentData.order_id)}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
            disabled={loading}
          >
            {loading ? "Memeriksa..." : "Konfirmasi"}
          </button>
        </div>
      </div>
    </div>
  );
}
