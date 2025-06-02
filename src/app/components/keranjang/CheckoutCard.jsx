"use client";
import { useState } from "react";
import OrderTypeStep from "./OrderTypeStep";
import LocationStep from "./LocationStep";
import PaymentMethodStep from "./PaymentMethodStep";
import DeliveryPesan from "./Delivery_PesanAntar";
import DeliveryAmbil from "./Delivery_AmbilDiTempat";
import ConfirmationStep from "./ConfirmationCOD";
import TransferStep from "./TransferStep";
import DigitalPay from "./DigitalPayment";
import IuranSukarela from "./IuranSukarela";

export default function CheckoutCard({
  total,
  products = [],
  selectedItems = [],
  onCancel,
  onSubmitCheckout,
}) {
  const [step, setStep] = useState("orderType");
  const [orderType, setOrderType] = useState(null);
  const [location, setLocation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [digitalPayment, setDigitalPayment] = useState(null);
  const [iuranSukarela, setIuranSukarela] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const selectedItemsData = products.filter((p) =>
    selectedItems.includes(p.id)
  );

  const reset = () => {
    setStep("orderType");
    setOrderType(null);
    setLocation(null);
    setPaymentMethod(null);
    setDeliveryTime(null);
    setDigitalPayment(null);
    onCancel && onCancel();
  };

  const handleConfirm = () => {
    const payment_method =
      sessionStorage.getItem("payment_method") || paymentMethod;
    const itemToPay = selectedItemsData.map((item) => ({
      product_id: item.id,
      jumlah: item.quantity,
    }));

    console.log("item on Pay = ", itemToPay);

    onSubmitCheckout?.({
      items: itemToPay,
      payment_method,
    });

    setConfirmed(true);

    if (orderType === "Pesan antar") {
      setSuccessMessage("Barang berhasil dibeli dan segera diantar");
    } else if (orderType === "Ambil di tempat") {
      setSuccessMessage("Barang siap dibeli di tempat");
    }

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
      reset();
      setConfirmed(false);
    }, 2500);
  };

  return (
    <>
      {!confirmed && (
        <>
          {step === "orderType" && (
            <OrderTypeStep
              onContinue={(selectedOrderType) => {
                setOrderType(selectedOrderType);
                setStep("location");
              }}
              onCancel={reset}
            />
          )}
          {step === "location" && (
            <LocationStep
              orderType={orderType}
              onContinue={() => {
                if (orderType === "Pesan antar") {
                  setStep("deliveryTimePesanAntar");
                } else {
                  setStep("deliveryTimeAmbil");
                }
              }}
              onCancel={() => setStep("orderType")}
            />
          )}
          {step === "deliveryTimePesanAntar" && (
            <DeliveryPesan
              onContinue={(time) => {
                setDeliveryTime(time);
                setStep("paymentMethod");
              }}
              onCancel={() => setStep("location")}
            />
          )}
          {step === "deliveryTimeAmbil" && (
            <DeliveryAmbil
              onContinue={(time) => {
                setDeliveryTime(time);
                setStep("paymentMethod");
              }}
              onCancel={() => setStep("location")}
            />
          )}
          {step === "paymentMethod" && (
            <PaymentMethodStep
              onContinue={(method) => {
                setPaymentMethod(method);
                sessionStorage.setItem("payment_method", method);
                if (method === "cod") {
                  setStep("confirmation");
                } else if (method === "Transfer") {
                  setStep("transfer");
                } else if (method === "Iuran Sukarela") {
                  setStep("iuranSukarela");
                }
              }}
              onCancel={() => setStep("location")}
            />
          )}
          {step === "confirmation" && (
            <ConfirmationStep
              total={total}
              items={selectedItemsData}
              onConfirm={handleConfirm}
              onCancel={() => setStep("paymentMethod")}
            />
          )}
          {step === "transfer" && (
            <TransferStep
              total={total}
              items={selectedItemsData}
              onContinue={() => {
                setStep("digitalPayment");
              }}
              onCancel={() => setStep("paymentMethod")}
            />
          )}
          {step === "digitalPayment" && (
            <DigitalPay
              total={total}
              onConfirm={handleConfirm}
              onContinue={() => {
                setStep("confirmation");
              }}
              onCancel={() => setStep("paymentMethod")}
            />
          )}
          {step === "iuranSukarela" && (
            <IuranSukarela
              total={total}
              items={selectedItemsData}
              onConfirm={handleConfirm}
              onContinue={() => {
                setStep("confirmation");
              }}
              onCancel={() => setStep("paymentMethod")}
            />
          )}
        </>
      )}

      {showSuccess && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-xl shadow-md text-sm flex items-center gap-2 z-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {successMessage}
        </div>
      )}
    </>
  );
}
