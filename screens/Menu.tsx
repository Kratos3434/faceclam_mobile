import { Image, SafeAreaView, Text, View } from "react-native";
import { styles } from "../styles";
import { useAtom } from "jotai";
import { currentUserAtom } from "../store";

const Menu = () => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10}}>
        <Text style={{color: 'black', fontWeight: 'bold', fontSize: 25}}>Menu</Text>
      </View>
      <View style={{marginHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderRadius: 6, backgroundColor: 'white', paddingHorizontal: 8, paddingVertical: 8, gap: 5}}>
        <Image source={{uri: currentUser?.profilePicture}} width={30} height={30} style={{borderRadius: 1000}} />
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          {currentUser?.firstName} {currentUser?.lastName}
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default Menu;