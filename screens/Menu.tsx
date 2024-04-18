import { Alert, Image, SafeAreaView, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { useAtom } from "jotai";
import { currentUserAtom, loginAtom } from "../store";
import * as SecureStore from 'expo-secure-store';

const Menu = ({ navigation }: { navigation: any }) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [login, loggedIn] = useAtom(loginAtom);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('token');
    setCurrentUser(null);
    loggedIn(false);
  }

  const openConfModal = async () => {
    Alert.alert('Log out of your account?', undefined, [
      {
        text: 'Cancel',
        // onPress: () => console.log('logout cancelled'),
        style: 'cancel'
      },
      {
        text: 'Log out',
        onPress: async () => await handleLogout(),
        style: 'destructive'
      }
    ])
  }
  // name: `${currentUser?.firstName}.${currentUser?.lastName}.${currentUser?.id}`
  const goToProfile = () => {
    navigation.push('Profile', {
      screen: 'Posts',
      params: { name: `${currentUser?.firstName}.${currentUser?.lastName}.${currentUser?.id}` }
    });
  }

  return (
    <SafeAreaView style={styles.MenuSafeArea}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10 }}>
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 25 }}>Menu</Text>
      </View>
      <TouchableHighlight style={{ marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 6, backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 8, gap: 5, elevation: 3 }} onPress={goToProfile} activeOpacity={0.6} underlayColor="#D3D3D3">
        <>
          <Image source={{ uri: currentUser?.profilePicture }} width={30} height={30} style={{ borderRadius: 1000 }} />
          <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
            {currentUser?.firstName} {currentUser?.lastName}
          </Text>
        </>
      </TouchableHighlight>
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 6, backgroundColor: 'rgb(243 244 246)', marginHorizontal: 16, paddingVertical: 7, marginVertical: 8 }} onPress={openConfModal}>
        <Text style={{ color: 'black', fontWeight: 'bold' }}>
          Log out
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Menu;