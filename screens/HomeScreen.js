import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import ExploreHeader from "../components/ExploreHeader";
import Listings from "../components/Listings";
import listingsData from "../data/airbnb-listings.json";

const Page = () => {
  const items = useMemo(() => listingsData, []);
  const [category, setCategory] = useState("Tiny homes");

  const onDataChanged = (category) => {
    setCategory(category);
  };

  return (
    <View style={styles.pageContainer}>
      <ExploreHeader onDataChanged={onDataChanged} selectedCategory={category} />
      <Listings listings={items} category={category} refresh={0} />
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
});