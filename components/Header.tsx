import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';

interface Props {
  heading: string,
  navigation: any
}

const Header = ({ heading, navigation }: Props) => {
  return (
    <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', position: 'relative', justifyContent: 'center' }}>
      <TouchableOpacity style={{ position: 'absolute', left: 0, zIndex: 100 }} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
        {heading}
      </Text>
    </View>
  )
}

export default Header;