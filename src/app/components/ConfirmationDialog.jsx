"use client";

export default function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isDestructive,

  activateConfirmBgColor = "bg-black",
  activateConfirmTextColor = "text-white",
  productName,
}) {
  if (!isOpen) return null;

  const dialogMessage = productName
    ? message.replace("produk ini", `<strong>${productName}</strong>`)
    : message;

  const activateCancelTextColor = "text-[#EF4444]";

  return (
    <div className="fixed inset-0 bg-white/40 flex justify-center items-center z-50 p-4">
      {isDestructive ? (
        <div className="w-80 p-4 bg-white rounded-xl shadow-[-8px_0px_24px_16px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-center overflow-hidden outline outline-gray-200">
          <div className="self-stretch flex flex-col justify-center items-center gap-5">
            <div className="self-stretch flex flex-col justify-start items-center gap-2">
              <div className="text-center justify-start text-black text-xl font-semibold font-['Geist']">
                {title}
              </div>
              <div
                className="self-stretch text-center justify-start text-[#969696] text-sm font-normal font-['Geist'] leading-tight"
                dangerouslySetInnerHTML={{ __html: dialogMessage }}
              />
            </div>
            <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
              <div className="self-stretch inline-flex justify-center items-center gap-4">
                <button
                  onClick={onCancel}
                  className="flex-1 h-10 px-2 bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] outline outline-offset-[-1px] flex justify-center items-center gap-1 overflow-hidden outline-gray-200 cursor-pointer"
                >
                  <div className="px-2 flex justify-center items-center">
                    <div className="justify-start text-black text-sm font-medium font-['Geist'] leading-normal">
                      {cancelText}
                    </div>
                  </div>
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 self-stretch px-2 bg-[#ee4343] rounded-lg outline outline-offset-[-1px] flex justify-center items-center gap-1 overflow-hidden outline-gray-200 cursor-pointer"
                >
                  <div className="px-2 flex justify-center items-center">
                    <div className="justify-start text-white text-sm font-medium font-['Geist'] leading-normal">
                      {confirmText}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-80 p-4 bg-white rounded-xl shadow-[-8px_0px_24px_16px_rgba(0,0,0,0.04)] inline-flex flex-col justify-start items-center overflow-hidden outline outline-gray-200">
          <div className="self-stretch flex flex-col justify-center items-center gap-5">
            <div className="self-stretch flex flex-col justify-start items-center gap-2">
              <div className="self-stretch text-center justify-start text-black text-xl font-semibold font-['Geist']">
                {title}
              </div>
              <div
                className="self-stretch text-center justify-start text-[#969696] text-sm font-normal font-['Geist'] leading-tight"
                dangerouslySetInnerHTML={{ __html: dialogMessage }}
              />
            </div>
            <div className="self-stretch flex flex-col justify-center items-center gap-2.5">
              <div className="self-stretch inline-flex justify-center items-center gap-4">
                <button
                  onClick={onCancel}
                  className="flex-1 h-10 px-2 bg-gray-100 rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.04)] outline outline-offset-[-1px] flex justify-center items-center gap-1 overflow-hidden outline-gray-200"
                >
                  <div className="px-2 flex justify-center items-center">
                    {/* Menggunakan activateCancelTextColor untuk tombol batal pada dialog "Activate" */}
                    <div
                      className={`justify-start ${activateCancelTextColor} text-sm font-medium font-['Geist'] leading-normal cursor-pointer`}
                    >
                      {cancelText}
                    </div>
                  </div>
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 self-stretch px-2 ${activateConfirmBgColor} rounded-lg outline outline-gray-200 outline-offset-[-1px] flex justify-center items-center gap-1 overflow-hidden cursor-pointer`}
                >
                  <div className="px-2 flex justify-center items-center">
                    <div
                      className={`justify-start ${activateConfirmTextColor} text-sm font-medium font-['Geist'] leading-normal`}
                    >
                      {confirmText}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
