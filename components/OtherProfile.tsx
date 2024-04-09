import { View, TouchableOpacity, Text, Image, ScrollView, ActivityIndicator } from "react-native";
import { UserProps } from "../types";
import { Ionicons, Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useState, useMemo } from "react";
// import BottomSheet, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useAtom } from "jotai";
import { respondBottomSheetIndexAtom } from "../store";

interface Props {
  user: UserProps,
  navigation: any,
  currentUser: UserProps | null
}

const OtherProfile = ({ user, navigation, currentUser }: Props) => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const [loading, setLoading] = useState(false);
  const [respondBottomSheetIndex, setRespondBottomSheetIndex] = useAtom(respondBottomSheetIndexAtom);

  const handleModalSheetOpen = () => setRespondBottomSheetIndex(0);

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
        <Image source={user.coverPicture ? { uri: user.coverPicture } : require('../assets/gray_bg.jpg')} height={200} resizeMode="stretch" style={{ height: 200 }} />
        {/* <Image source={{uri: query.data?.profilePicture}} width={100} height={100} style={{borderRadius: 1000, position: 'absolute', bottom: -50}} /> */}
        <View style={{ paddingHorizontal: 16, backgroundColor: 'white', position: 'relative' }}>
          <Image source={user.profilePicture ? { uri: user.profilePicture } : require('../assets/placeholder.png')} width={150} height={150} style={{ borderRadius: 1000, position: 'absolute', bottom: user.bio ? 115 : 95, left: 8, borderWidth: 3, borderColor: 'white', width: 150, height: 150 }} />
          <View style={{ paddingTop: 25 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={{ flexDirection: 'row', gap: 3, marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{user.friends.length}</Text>
              <Text style={{ color: 'gray' }}>friends</Text>
            </View>
            {user.bio && <Text>{user.bio}</Text>}
            <View style={{ flexDirection: 'row', marginVertical: 3 }}>
              {
                loading ?
                  (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }}>
                      <ActivityIndicator size={16} color="white" />
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel request</Text>
                    </View>
                  ) :
                  (
                    user.friendRequest && user.friendRequest.friendId !== currentUser?.id ?
                      (
                        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }} onPress={handleModalSheetOpen}>
                          <Feather name="user-check" size={16} color="white" />
                          <Text style={{ color: 'white', fontWeight: 'bold' }}>Respond</Text>
                        </TouchableOpacity>
                      ) :
                      (
                        user.areFriends ?
                          (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }}>
                              <AntDesign name="check" size={16} color="white" />
                              <Text style={{ color: 'white', fontWeight: 'bold' }}>Friends</Text>
                            </View>
                          ) :
                          (
                            !user.friendRequest ?
                              (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }}>
                                  <AntDesign name="adduser" size={16} color="white" />
                                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Add friend</Text>
                                </View>
                              ) :
                              (
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }}>
                                  <MaterialCommunityIcons name="account-cancel-outline" size={16} color="white" />
                                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel request</Text>
                                </View>
                              )
                          )
                      )
                  )
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  )
}

export default OtherProfile;