import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../firebase';

const SavedScreen = () => {
  const [savedListings, setSavedListings] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Listen for real-time changes in saved listings
    const unsubscribe = onSnapshot(collection(db, 'savedListings'), (snapshot) => {
      const savedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSavedListings(savedData);
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const unsaveListing = async (item) => {
    try {
      await deleteDoc(doc(db, 'savedListings', item.id));
    } catch (error) {
      console.error('Error unsaving listing:', error);
    }
  };

  return (
    <View style={styles.container}>
      {savedListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved listings yet</Text>
        </View>
      ) : (
        <ScrollView>
          {savedListings.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => navigation.navigate('Details', { item })}
              style={styles.listing}
            >
              <Image source={{ uri: item.medium_url }} style={styles.image} />

              {/* Heart icon for unsaving */}
              <TouchableOpacity style={styles.heartIcon} onPress={() => unsaveListing(item)}>
                <Ionicons name="heart" size={24} color="#4CAF50" />
              </TouchableOpacity>

              {/* Listing details */}
              <View style={styles.listingDetails}>
                <Text style={styles.listingName}>{item.name}</Text>
                <Text style={styles.roomType}>{item.room_type}</Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>€ {item.price} / night</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F0F4F8",
    marginTop: '12%',
  },
  listing: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
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
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#888',
  },
});

export default SavedScreen;