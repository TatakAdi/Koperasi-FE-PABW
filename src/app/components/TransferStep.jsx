'use client';
import { useState, useEffect } from 'react';

export default function TransferStep({ productName, quantity, total, onContinue, onCancel }) {
  return (
    <div
      className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4"
      style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}
    >
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Konfirmasi Pembayaran Transfer</h2>

        <div className="space-y-1">
          <p className="text-gray-600">{productName}</p>
          <div className="flex justify-between">
            <span>{quantity}x</span>
            <span className="font-medium">Rp. {total ? total.toLocaleString('id-ID') : 0}</span>
          </div>
        </div>

        <hr className="my-2 border-gray-300" />

        <div className="flex justify-between text-base">
          <span className="font-medium">Total</span>
          <span className="font-bold">Rp. {total ? total.toLocaleString('id-ID') : 0}</span>
        </div>

        <div className="flex justify-between gap-3 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg border border-gray-300 text-black text-sm font-medium hover:bg-gray-100 transition"
          >
            Kembali
          </button>
          <button
            onClick={onContinue}
            className="flex h-10 px-4 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}