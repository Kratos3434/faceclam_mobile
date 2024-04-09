import { View, TouchableOpacity, Text, Image, ScrollView } from "react-native";
import { UserProps } from "../types";
import { Ionicons } from '@expo/vector-icons'

interface Props {
  user: UserProps,
  navigation: any,
  currentUser: UserProps | null
}

const OtherProfile = ({ user, navigation, currentUser }: Props) => {
  return (
    <>
      <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', position: 'relative', justifyContent: 'center' }}>
        <TouchableOpacity style={{ position: 'absolute', left: 0, zIndex: 100 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
          (other) {user.firstName} {user.lastName}
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <Image source={{ uri: user.coverPicture }} height={200} resizeMode="stretch" />
        {/* <Image source={{uri: query.data?.profilePicture}} width={100} height={100} style={{borderRadius: 1000, position: 'absolute', bottom: -50}} /> */}
        <View style={{ paddingHorizontal: 16, backgroundColor: 'white', position: 'relative' }}>
          <Image source={{ uri:user.profilePicture }} width={120} height={120} style={{ borderRadius: 1000, position: 'absolute', bottom: 50, left: 8, borderWidth: 3, borderColor: 'white' }} />
          <View style={{ paddingTop: 25 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={{ flexDirection: 'row', gap: 3, marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{user.friends.length}</Text>
              <Text style={{ color: 'gray' }}>friends</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default OtherProfile;