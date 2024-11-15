import React, { useEffect, useState } from 'react';
import { View, Alert, Button } from 'react-native';
import { useStripe } from "@stripe/stripe-react-native";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

const API_URL = "http://10.0.0.92:4242";

export default function CheckoutScreen({ route }) {
  const { totalCost, itemName } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    console.log('Total Cost:', totalCost); // Debug value

    const amountInCents = Math.round(totalCost * 100); // Convert dollars to cents
    if (isNaN(amountInCents) || amountInCents <= 0) {
      console.error('Invalid amount:', amountInCents);
      Alert.alert('Invalid amount for payment'); // User feedback
      return;
    }

    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amountInCents,
      }),
    });

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    console.log('Payment Details:', { customer, ephemeralKey, paymentIntent, totalCost });

    // Save the payment details in Firestore under "Payment" collection
    await addDoc(collection(db, 'Payment'), {
      customerId: customer,
      ephemeralKey,
      paymentIntent,
      amountPaid: totalCost,
      timestamp: Timestamp.now(),
    });

    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: 'Social Garden',
      });

      if (error) {
        console.error('Error initializing payment sheet:', error);
        Alert.alert('Payment Initialization Failed', error.message);
        return;
      }

      setLoading(true);
    } catch (error) {
      console.error('Error initializing payment sheet:', error);
      Alert.alert('Initialization Error', 'Failed to initialize payment sheet.');
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
    console.log(`Item Name: ${itemName}, Total Cost: ${totalCost}`);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Checkout"
        disabled={!loading}
        onPress={openPaymentSheet}
      />
    </View>
  );
}
