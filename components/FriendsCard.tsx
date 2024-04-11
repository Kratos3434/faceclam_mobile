import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { UserProps } from "../types";
import { Fragment } from "react";

interface Props {
  user: UserProps
}

const FriendsCard = ({ user }: Props) => {

  const handlePress = () => {
    
  }

  return (
    <TouchableWithoutFeedback>
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