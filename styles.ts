import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'gray',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  }
});