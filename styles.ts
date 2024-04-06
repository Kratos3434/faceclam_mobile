import { Platform, StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  LoginSafeArea: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  MenuSafeArea: {
    flex: 1,
    backgroundColor: '#D3D3D3',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});