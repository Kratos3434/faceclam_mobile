import { Image, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { UserProps } from "../types";
import { MaterialIcons } from '@expo/vector-icons';


interface Props {
  user: UserProps,
  navigation: any
}

const WhatsOnYourMind = ({ user, navigation }: Props) => {

  const createStatus = () => {
    navigation.push('CreateStatus');
  }

  return (
    <View style={{flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', backgroundColor: 'white', marginBottom: 5, gap: 5, paddingVertical: 5}}>
      <Image source={{uri: user.profilePicture}} width={30} height={30} style={{borderRadius: 1000}} />
      <TouchableHighlight style={{flex: 1, borderRadius: 10, paddingVertical: 10, paddingHorizontal: 5}} onPress={createStatus} activeOpacity={0.6} underlayColor="#DDDDDD">
        <Text>What's on your mind?</Text>
      </TouchableHighlight>
      <TouchableHighlight>
        <MaterialIcons name="perm-media" size={20} color="green" />
      </TouchableHighlight>
    </View>
  );
}

export default WhatsOnYourMind;