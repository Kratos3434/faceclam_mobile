import { Image, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { useAtom } from "jotai";
import { currentUserAtom, loginAtom } from "../store";
import * as SecureStore from 'expo-secure-store';

const Menu = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [login, loggedIn] = useAtom(loginAtom);
  
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setCurrentUser(null);
    loggedIn(false);
  }

  return (
    <SafeAreaView style={styles.MenuSafeArea}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10}}>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>Menu</Text>
      </View>
      <View style={{marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 6, backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 8, gap: 5}}>
        <Image source={{uri: currentUser?.profilePicture}} width={30} height={30} style={{borderRadius: 1000}} />
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          {currentUser?.firstName} {currentUser?.lastName}
        </Text>
      </View>
      <TouchableOpacity style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: 'rgb(243 244 246)', marginHorizontal: 16, paddingVertical: 7, marginVertical: 8}} onPress={handleLogout}>
        <Text style={{color: 'black', fontWeight: 'bold'}}>
          Log out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Menu;