import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { StripeProvider } from '@stripe/stripe-react-native';
import StackNavigator from './StactNavigator';

export default function App() {
  const [publishableKey, setPublishableKey] = useState('');

  const fetchPublishableKey = async () => {
    try {
      const response = await fetch('http://10.0.0.92:4242/config'); // Replace with your backend URL
      const data = await response.json();
      console.log('Publishable Key:', data.publishableKey); // Log to verify
      setPublishableKey(data.publishableKey);
    } catch (error) {
      console.error('Error fetching publishable key:', error);
      Alert.alert('Error', 'Unable to fetch publishable key.');
    }
  };

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  if (!publishableKey) {
    // Display a loading indicator while fetching the publishable key
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <StackNavigator />
    </StripeProvider>
  );
}
