import { Image, Text, TouchableOpacity, View } from "react-native";
import { UserProps } from "../types";
import { MaterialIcons } from '@expo/vector-icons';


interface Props {
  user: UserProps
}

const WhatsOnYourMind = ({ user }: Props) => {
  return (
    <View style={{flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', backgroundColor: 'white', marginBottom: 5, paddingVertical: 10, gap: 5}}>
      <Image source={{uri: user.profilePicture}} width={30} height={30} style={{borderRadius: 1000}} />
      <TouchableOpacity style={{flex: 1}}>
        <Text>What's on your mind?</Text>
      </TouchableOpacity>
      <MaterialIcons name="perm-media" size={20} color="green" />
    </View>
  );
}

export default WhatsOnYourMind;