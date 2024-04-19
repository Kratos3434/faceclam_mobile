import { TouchableHighlight, Text, View } from "react-native";
// import { Foundation } from '@expo/vector-icons';

interface Props {
  name: string,
  icon: any,
  onPress: any
}

const MenuCard = ({ name, icon, onPress }: Props) => {
  return (
    <TouchableHighlight onPress={onPress} style={{ backgroundColor: 'white', borderRadius: 16, padding: 8, elevation: 8, flex: 1 }} activeOpacity={0.6} underlayColor="#D3D3D3">
      <View>
        {icon}
        <Text style={{ fontWeight: '600' }}>{name}</Text>
      </View>
    </TouchableHighlight>
  )
}

export default MenuCard;