import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [savedListingsIds, setSavedListingsIds] = useState([]); // to store the IDs of saved listings
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch listings once
    const fetchListings = async () => {
      const unsubscribe = onSnapshot(collection(db, 'listings'), (querySnapshot) => {
        const listingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setListings(listingsData);
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    };

    fetchListings();

    // Listen for changes to saved listings
    const unsubscribeSaved = onSnapshot(collection(db, 'savedListings'), (snapshot) => {
      const savedIds = snapshot.docs.map((doc) => doc.id);
      setSavedListingsIds(savedIds); // Update the saved listing IDs
    });

    return () => unsubscribeSaved(); // Clean up the listener on unmount
  }, []);

  const toggleSaveListing = async (item) => {
    const isSaved = savedListingsIds.includes(item.id);
    try {
      if (isSaved) {
        await deleteDoc(doc(db, 'savedListings', item.id));
      } else {
        await setDoc(doc(db, 'savedListings', item.id), item);
      }
    } catch (error) {
      console.error('Error saving/unsaving listing:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {listings.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() => navigation.navigate('Details', { item })}
          style={styles.listing}
        >
          <Image source={{ uri: item.medium_url }} style={styles.image} />
          
          {/* Heart icon */}
          <TouchableOpacity style={styles.heartIcon} onPress={() => toggleSaveListing(item)}>
            <Ionicons
              name={savedListingsIds.includes(item.id) ? "heart" : "heart-outline"}
              size={24}
              color={savedListingsIds.includes(item.id) ? "#4CAF50" : "#4CAF50"} // green heart for unsaved
            />
          </TouchableOpacity>
          
          {/* Listing details */}
          <View style={styles.listingDetails}>
            <Text style={styles.listingName}>{item.name}</Text>
            <Text style={styles.roomType}>{item.location}</Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>€{item.price}</Text>
            <Text style={styles.pricePerNight}> / Duration</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F4F8",
  },
  listing: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: "100%",
    height: 200,
  },
  heartIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 2 },
  },
  listingDetails: {
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  listingName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  roomType: {
    marginTop: 4,
    fontSize: 14,
    color: "#777777",
  },
  description: {
    marginTop: 4,
    fontSize: 14,
    color: "#777777",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
  },
  pricePerNight: {
    fontSize: 14,
    color: "#666666",
  },
});

export default Listings;