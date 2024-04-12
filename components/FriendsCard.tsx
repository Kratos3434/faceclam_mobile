import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { UserProps } from "../types";

interface Props {
  user: UserProps,
  navigation: any
}

const FriendsCard = ({ user, navigation }: Props) => {

  const handlePress = () => {
    navigation.push('Profile', {
      screen: 'Posts',
      params: {name: `${user.firstName}.${user.lastName}.${user.id}`}
    });
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={{ borderRadius: 10, backgroundColor: 'white', width: 110, height: 150, elevation: 10, gap: 5 }}>
        <Image source={user.profilePicture ? { uri: user.profilePicture } : require('../assets/placeholder.png')} height={100} style={{ height: 100, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
        <Text style={{ fontWeight: 'bold', paddingHorizontal: 16 }}>
          {user.firstName} {user.lastName}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default FriendsCard;