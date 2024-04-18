import { Image, Text, TouchableHighlight, View } from "react-native";
import { UserProps } from "../types";
import { httpToHTTPS } from "../helpers";

interface Props {
  user: UserProps,
  navigation: any
}

const DisplayFriend = ({ user, navigation }: Props) => {
  const goToProfile = () => {
    navigation.push('Profile', {
      screen: 'Posts',
      params: { name: `${user.firstName}.${user.lastName}.${user.id}` }
    });
  }

  return (
    <TouchableHighlight style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 7, gap: 5 }} activeOpacity={0.6} underlayColor="#DDDDDD" 
    onPress={goToProfile}>
      <>
        <Image source={user.profilePicture ? { uri: httpToHTTPS(user.profilePicture) } : require('../assets/placeholder.jpg')} width={30} height={30} style={{ borderRadius: 1000, width: 50, height: 50 }} />
        <Text style={{ fontWeight: '600' }}>{user.firstName} {user.lastName}</Text>
      </>
    </TouchableHighlight>
  )
}

export default DisplayFriend;