import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const ExploreHeader = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.actionRow}>
          {/* Messages Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate("ChatList")}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#4CAF50" />
          </TouchableOpacity>

          {/* Create Listing Icon */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.navigate('CreateListing')} // Navigate to CreateListing

          >
            <Ionicons name="create" size={24} color="#4CAF50" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F0F4F8",
    paddingTop: 16,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  iconBtn: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#C0C0C0",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 1, height: 3 },
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ExploreHeader;