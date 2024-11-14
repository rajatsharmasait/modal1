import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./StactNavigator";

export default function App() {
  return (
    <>
      <StackNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
