import { Text } from "react-native";
import ProfileLayout from "./ProfileLayout";

const Photos = ({ navigation }: { navigation: any }) => {

  return (
    <ProfileLayout navigation={navigation} setUser={null}>
      <Text>Photos</Text>
    </ProfileLayout>
  )
}

export default Photos;