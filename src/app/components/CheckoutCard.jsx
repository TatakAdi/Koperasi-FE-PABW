'use client';
import { useState } from 'react';
import OrderTypeStep from './OrderTypeStep';
import LocationStep from './LocationStep';
import PaymentMethodStep from './PaymentMethodStep';
import DeliveryPesan from './Delivery_PesanAntar';
import DeliveryAmbil from './Delivery_AmbilDiTempat';
import ConfirmationStep from './ConfirmationCOD';
import TransferStep from './TransferStep';
import DigitalPay from './DigitalPayment';

export default function CheckoutCard({ total, onCancel }) {
  const [step, setStep] = useState('orderType');
  const [orderType, setOrderType] = useState(null);
  const [location, setLocation] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState(null);
  const [digitalPayment, setDigitalPayment] = useState(null);

  const reset = () => {
    setStep('orderType');
    setOrderType(null);
    setLocation(null);
    setPaymentMethod(null);
    setDeliveryTime(null);
    setDigitalPayment(null);
    onCancel && onCancel();
  };

  const handleConfirm = () => {
    alert('Pembelian dikonfirmasi!');
    reset();
  };

  return (
    <>
      {step === 'orderType' && (
        <OrderTypeStep
          onContinue={(selectedOrderType) => {
            setOrderType(selectedOrderType);
            setStep('location');
          }}
          onCancel={reset}
        />
      )}
      {step === 'location' && (
        <LocationStep
          orderType={orderType}
          onContinue={() => {
            if (orderType === 'Pesan antar') {
              setStep('deliveryTimePesanAntar');
            } else {
              setStep('deliveryTimeAmbil');
            }
          }}
          onCancel={() => setStep('orderType')}
        />
      )}
      {step === 'deliveryTimePesanAntar' && (
        <DeliveryPesan
          onContinue={(time) => {
            setDeliveryTime(time);
            setStep('paymentMethod');
          }}
          onCancel={() => setStep('location')}
        />
      )}
      {step === 'deliveryTimeAmbil' && (
        <DeliveryAmbil
          onContinue={(time) => {
            setDeliveryTime(time);
            setStep('paymentMethod');
          }}
          onCancel={() => setStep('location')}
        />
      )}
      {step === 'confirmation' && (
        <ConfirmationStep
          total={total}
          onConfirm={handleConfirm}
          onCancel={() => setStep('paymentMethod')}
        />
      )}
      {step === 'paymentMethod' && (
        <PaymentMethodStep
          onContinue={(method) => {
            setPaymentMethod(method);
            if (method === 'COD') {
              setStep('confirmation');
            } else if (method === 'Transfer') {
              setStep('transfer');
            }
          }}
          onCancel={() => setStep('location')}
        />
      )}
      {step === 'transfer' && (
        <TransferStep
          total={total}
          onContinue={() => {
            setStep('digitalPayment');
          }}
          onCancel={() => setStep('paymentMethod')}
        />
      )}
      {step === 'digitalPayment' && (
        <DigitalPay
          total={total}
          onConfirm={handleConfirm}
          onContinue={() => {
            setStep('confirmation');
          }}
          onCancel={() => setStep('paymentMethod')}
        />
      )}

    </>
  );
}