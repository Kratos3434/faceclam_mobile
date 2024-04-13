import { Image, Text, TouchableHighlight, View } from "react-native";
import { UserProps } from "../types";
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAtom } from "jotai";
import { selectedPhotoAtom } from "../store";

interface Props {
  user: UserProps,
  navigation: any
}

const WhatsOnYourMind = ({ user, navigation }: Props) => {
  const [selectedPhoto, setSelectedPhoto] = useAtom(selectedPhotoAtom);

  const createStatus = () => {
    navigation.push('CreateStatus');
  }

  const pickImageAsync = async () => {
    navigation.push('AddPost');
    setSelectedPhoto(null);
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 1
    });

    if (!result.canceled) {
      setSelectedPhoto(result.assets[0]);
      // navigation.push('AddPost');
    } else {
      console.log('No image selected');
      navigation.navigate('HomeScreen');
    }
  }

  return (
    <View style={{flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', backgroundColor: 'white', borderBottomWidth: 5, gap: 5, paddingVertical: 5, borderColor: '#E4E5E7'}}>
      <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => {
        navigation.push('Profile', {
          screen: 'Posts',
          params: {name: `${user.firstName}.${user.lastName}.${user.id}`}
        });
      }} style={{borderRadius: 1000}}>
        <Image source={user.profilePicture ? {uri: user.profilePicture} : require('../assets/placeholder.png')} width={40} height={40} style={{borderRadius: 1000, width: 40, height: 40}} />
      </TouchableHighlight>
      <TouchableHighlight style={{flex: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 5}} onPress={createStatus} activeOpacity={0.6} underlayColor="#DDDDDD">
        <Text>What's on your mind?</Text>
      </TouchableHighlight>
      <TouchableHighlight onPress={pickImageAsync} underlayColor="white">
        <MaterialIcons name="perm-media" size={20} color="green" />
      </TouchableHighlight>
    </View>
  );
}

export default WhatsOnYourMind;