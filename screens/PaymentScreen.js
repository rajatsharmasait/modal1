import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/core";
import { Ionicons } from "@expo/vector-icons";
import CheckoutScreen from "./CheckoutScreen";


const PaymentScreen = ({ route }) => {
  const { item } = route.params; 
  const [months, setMonths] = useState("1");
  const [total, setTotal] = useState(item.price);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleMonthsChange = (value) => {
    if (value === "") {
        setMonths("");
        setTotal(0); 
        return;
      }
      
    const parsedMonths = parseInt(value, 10);
    if (!isNaN(parsedMonths) && parsedMonths > 0) {
      setMonths(value);
      setTotal(parsedMonths * item.price);
    } else {
      setMonths("1");
      setTotal(item.price);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      navigation.navigate('CheckoutScreen', { 
        totalCost: total,   
        itemName: item.name
       });
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Payment Failed', 'Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2D572C" />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.container}>
        <Image source={{ uri: item.medium_url }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.subtitle}>Location: {item.location}</Text>
          <Text style={styles.subtitle}>Hosted by: {item.host_name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per Month:</Text>
            <Text style={styles.priceValue}>€{item.price}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Lease Duration (Months):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={months}
              onChangeText={handleMonthsChange}
            />
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Cost:</Text>
            <Text style={styles.totalValue}>€{total}</Text>
          </View>

     
          <TouchableOpacity style={styles.paymentButton} onPress={handlePayment}>
            <Ionicons name="card-outline" size={20} color="white" />
            <Text style={styles.paymentButtonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  details: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#2D572C",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 16,
    color: "#2D572C",
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: "#C8E6C9",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 18,
    color: "#2D572C",
    fontWeight: "700",
  },
  paymentButton: {
    backgroundColor: "#2D572C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  paymentButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default PaymentScreen;


// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   TextInput,
//   Alert,
// } from "react-native";
// import { useStripe } from "@stripe/stripe-react-native";
// import { Ionicons } from "@expo/vector-icons";
// import { addDoc, collection, Timestamp } from "firebase/firestore";
// import { db } from "../firebase";
 
// const API_URL = "http://10.0.0.92:4242";
 
// const PaymentScreen = ({ route }) => {
//   const { item } = route.params;
//   const [months, setMonths] = useState("1");
//   const [total, setTotal] = useState(item.price);
//   const [errorMessage, setErrorMessage] = useState(""); // Error state
//   const [loading, setLoading] = useState(false);
//   const { initPaymentSheet, presentPaymentSheet } = useStripe();
 
//   const handleMonthsChange = (value) => {
//     if (value.trim() === "") {
//       setErrorMessage("Please enter a valid number of months.");
//       setMonths("");
//       setTotal(0);
//       return;
//     }
 
//     const parsedMonths = parseInt(value, 10);
//     if (!isNaN(parsedMonths) && parsedMonths > 0) {
//       setErrorMessage(""); // Clear error message
//       setMonths(value);
//       setTotal(parsedMonths * item.price);
//     } else {
//       setErrorMessage("Invalid input. Enter a positive number.");
//       setMonths("");
//       setTotal(0);
//     }
//   };
 
//   const fetchPaymentSheetParams = async () => {
//     try {
//       const amountInCents = Math.round(total * 100);
  
//       const response = await fetch(`${API_URL}/payment-sheet`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ amount: amountInCents }),
//       });
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       const { paymentIntent, ephemeralKey, customer } = await response.json();
  
//       await addDoc(collection(db, "Payment"), {
//         customerId: customer,
//         ephemeralKey,
//         paymentIntent,
//         amountPaid: total,
//         timestamp: Timestamp.now(),
//       });
  
//       return { paymentIntent, ephemeralKey, customer };
//     } catch (error) {
//       console.error("Error fetching payment sheet params:", error);
//       Alert.alert("Error", "Failed to fetch payment details. Please try again.");
//       throw error;
//     }
//   };
  
 
//   const initializePaymentSheet = async () => {
//     try {
//       const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();
  
//       const { error } = await initPaymentSheet({
//         customerId: customer,
//         customerEphemeralKeySecret: ephemeralKey,
//         paymentIntentClientSecret: paymentIntent,
//         merchantDisplayName: "Social Garden",
//       });
  
//       if (error) {
//         console.error("InitPaymentSheet error:", error);
//         Alert.alert("Error initializing payment sheet", error.message);
//       } else {
//         setLoading(true);
//       }
//     } catch (error) {
//       console.error("Initialization failed:", error);
//       Alert.alert("Error", "Failed to initialize payment sheet.");
//     }
//   };
  
 
//   const openPaymentSheet = async () => {
//     try {
//       const { error } = await presentPaymentSheet();
  
//       if (error) {
//         console.error("Payment error:", error);
//         Alert.alert(`Error: ${error.code}`, error.message);
//       } else {
//         Alert.alert("Success", "Your payment is confirmed!");
//       }
//     } catch (error) {
//       console.error("PaymentSheet error:", error);
//       Alert.alert("Payment Failed", "An unexpected error occurred.");
//     }
//   };
  
 
//   useEffect(() => {
//     initializePaymentSheet();
//   }, [total]);
 
//   return (
//     <View style={styles.screenContainer}>
//       <View style={styles.container}>
//         <Image source={{ uri: item.medium_url }} style={styles.image} />
//         <View style={styles.details}>
//           <Text style={styles.title}>{item.name}</Text>
//           <Text style={styles.subtitle}>Location: {item.location}</Text>
//           <Text style={styles.subtitle}>Hosted by: {item.host_name}</Text>
 
//           <View style={styles.priceContainer}>
//             <Text style={styles.priceLabel}>Price per Month:</Text>
//             <Text style={styles.priceValue}>€{item.price}</Text>
//           </View>
 
//           <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>Lease Duration (Months):</Text>
//             <TextInput
//               style={styles.input}
//               keyboardType="numeric"
//               value={months}
//               onChangeText={handleMonthsChange}
//             />
//             {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
//           </View>
 
//           <View style={styles.totalContainer}>
//             <Text style={styles.totalLabel}>Total Cost:</Text>
//             <Text style={styles.totalValue}>€{total}</Text>
//           </View>
 
//           <TouchableOpacity
//             style={styles.paymentButton}
//             onPress={openPaymentSheet}
//             disabled={!loading}
//           >
//             <Ionicons name="card-outline" size={20} color="white" />
//             <Text style={styles.paymentButtonText}>
//               {loading ? "Proceed to Payment" : "Loading..."}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };
 
// const styles = StyleSheet.create({
//   screenContainer: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//   },
//   container: {
//     padding: 16,
//     backgroundColor: "#FFFFFF",
//     borderRadius: 10,
//     margin: 16,
//     shadowColor: "#000",
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   image: {
//     width: "100%",
//     height: 200,
//     borderRadius: 10,
//     marginBottom: 16,
//   },
//   details: {
//     paddingHorizontal: 10,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "600",
//     color: "#2D572C",
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#555",
//     marginBottom: 8,
//   },
//   priceContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },
//   priceLabel: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   priceValue: {
//     fontSize: 16,
//     color: "#2D572C",
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 16,
//     marginBottom: 4,
//   },
//   input: {
//     height: 40,
//     borderColor: "#C8E6C9",
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 8,
//   },
//   totalContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   totalLabel: {
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   totalValue: {
//     fontSize: 18,
//     color: "#2D572C",
//     fontWeight: "700",
//   },
//   paymentButton: {
//     backgroundColor: "#2D572C",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   paymentButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     marginLeft: 8,
//   },
//   errorText: {
//     color: "red",
//     fontSize: 14,
//     marginTop: 4,
//   },
// });
 
// export default PaymentScreen;