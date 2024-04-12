import { Text } from "react-native";
import ProfileLayout from "./ProfileLayout";

const Photos = ({ navigation, route }: { navigation: any, route: any }) => {
  const { name } = route.params;

  return (
    <ProfileLayout navigation={navigation} setUser={null} name={name}>
      <Text>{name}</Text>
    </ProfileLayout>
  )
}

export default Photos;