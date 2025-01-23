import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axiosInstance from '../../axios/axiosInterceptor';
import { API_BASE_URL } from '../../apiConfig';

interface StripePaymentModalProps {
  amount: number; // Amount in INR
  bookingId: string; // Getting booking Id from Booking details page already passed
  onSuccess: (data: any) => void;
  onClose: () => void;
}


const StripePaymentModal: React.FC<StripePaymentModalProps> = ({ amount, bookingId,onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.error('Stripe.js has not loaded yet.');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
        console.error('CardElement not found');
        return; // Exit on error
      }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error(error);
    } else {
      // Create payment intent in server
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/users/create-payment-intent`, {  
          amount: Math.round(amount * 100), // Stripe expects amount in cents, convert INR to paise
          currency: 'inr',
          payment_method_id: paymentMethod.id,
        });

        const { paymentIntentId } = response.data;

        const confirmResponse = await axiosInstance.post(`${API_BASE_URL}/users/confirm-payment`, {
          paymentIntentId,
          bookingId, 
        });

        onSuccess(confirmResponse.data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl mb-4">Complete Your Payment</h2>
        <p className="mb-4 text-lg">You need to pay: ₹{amount}</p>
        <form onSubmit={handleSubmit}>
          <CardElement />
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black p-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe}
              className="bg-blue-500 text-white p-2 rounded"
            >
               Pay ₹{amount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StripePaymentModal;