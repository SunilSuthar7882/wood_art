"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ErrorOutline } from "@mui/icons-material";
import PaymentStatusModal from "@/component/CommonComponents/PaymentStatusModal";

const PaymentForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [paymentElementMessage, setPaymentElementMessage] = useState(null);

  useEffect(() => {
    if (!elements) return;

    const paymentElement = elements.getElement("payment");
    if (paymentElement) {
      paymentElement.on("change", (event) => {
        setIsFormComplete(event.complete);
        setPaymentElementMessage(event.error?.message || null);
      });

      return () => {
        paymentElement.off("change");
      };
    }
  }, [elements]);

  const handleSubmit = async () => {
    if (!stripe || !elements || !isFormComplete) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: paymentError, paymentIntent } =
        await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/diet-plan`,
          },
          redirect: "if_required",
        });

      if (paymentError) {
        if (paymentError.type === "validation_error") {
          setError(paymentError.message ?? "Please check your payment details");
        } else {
          setError(paymentError.message ?? "An error occurred");
          setPaymentStatus("failed");
        }
        setProcessing(false);
        return;
      }

      if (paymentIntent) {
        switch (paymentIntent.status) {
          case "succeeded":
            setPaymentStatus("success");
            setError(null);
            setTimeout(() => router.push("/diet-plan"), 3000);
            break;
          case "processing":
            setError("Your payment is processing.");
            setPaymentStatus("processing");
            break;
          case "requires_payment_method":
            setError("Your payment was not successful, please try again.");
            setPaymentStatus("failed");
            break;
          default:
            setError("Something went wrong with your payment.");
            setPaymentStatus("failed");
            break;
        }
        setProcessing(false);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      setPaymentStatus("failed");
      setProcessing(false);
    }
  };

  const closeModal = () => {
    setPaymentStatus(null);
    setError(null);
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

        <div className="mb-4">
          <PaymentElement />
          {paymentElementMessage && (
            <div className="mt-2 text-sm text-red-400">
              {paymentElementMessage}
            </div>
          )}
        </div>

        {error && !paymentStatus && (
          <div className="mb-4 p-3 bg-red-700 text-white rounded-lg border border-red-700 flex items-center">
            <ErrorOutline className="mr-2" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="button"
          disabled={!stripe || processing || !isFormComplete}
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-3 rounded-full hover:bg-blue-700 transition duration-300 font-semibold disabled:opacity-50 flex items-center justify-center"
        >
          {processing ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Processing...
            </>
          ) : (
            "Complete Payment"
          )}
        </button>
      </div>

      <PaymentStatusModal
        open={!!paymentStatus}
        onClose={closeModal}
        status={paymentStatus}
        error={error}
      />
    </>
  );
};

export default PaymentForm;
