import { useState } from 'react';

export default function DeliveryTimeStep({ onContinue, onCancel }) {
  const [timeOption, setTimeOption] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!timeOption) {
      setError('Pilih Waktu Pengiriman');
      return;
    }
    if (timeOption === 'custom' && !customTime) {
      setError('Pilih Waktu Pengiriman');
      return;
    }
    setError('');
    onContinue(timeOption === 'now' ? 'Sekarang' : customTime);
  };

  return (
    <div className="fixed inset-0 bg-white/10 flex justify-center items-center z-50 px-4" style={{ backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-4">
        <h2 className="text-lg font-semibold">Waktu Pengiriman</h2>

        <button
          className={`w-full border rounded-lg px-4 py-3 text-left font-medium transition flex items-center ${
            timeOption === 'custom' ? 'bg-blue-50 border-blue-600 text-black' : 'bg-[#FCFCFC] border-gray-200 text-gray-700'
          }`}
          onClick={() => { setTimeOption('custom'); setError(''); }}
        >
          <span className="flex-1">Custom Hours</span>
          {timeOption === 'custom' && (
            <input
              type="time"
              value={customTime}
              onChange={(e) => { setCustomTime(e.target.value); setError(''); }}
              className="ml-4 w-40 border-none bg-transparent focus:ring-0 text-black"
              style={{ height: '2.25rem' }}
            />
          )}
        </button>

        {error && (
          <div className="text-xs text-red-500 mt-1">{error}</div>
        )}

        <div className="flex justify-between gap-3 w-full mt-4">
          <button
            onClick={onCancel}
            className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-white shadow-[0px_4px_4px_-0.5px_rgba(0,0,0,0.04),0px_0px_0px_1px_#E0E0E0,0px_2px_4px_0px_rgba(0,0,0,0.04)] text-red-500 text-sm font-medium hover:bg-red-50 transition"
          >
            Kembali
          </button>
          <button
            onClick={handleContinue}
            className="flex h-10 px-2 flex-1 justify-center items-center gap-1 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 transition"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
}