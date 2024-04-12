import { View, TouchableOpacity, Text, Image, ScrollView, ActivityIndicator, RefreshControl, TouchableHighlight, Modal } from "react-native";
import { UserProps } from "../types";
import { Ionicons, Feather, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { useState, useCallback } from "react";
import { useAtom } from "jotai";
import { respondBottomSheetIndexAtom, selectedProfileAtom, userIdAtom } from "../store";
import { useQueryClient } from "@tanstack/react-query";
import { userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';


interface Props {
  user: UserProps,
  navigation: any,
  currentUser: UserProps | null,
  children: React.ReactNode,
  name: any
}

const OtherProfile = ({ user, navigation, currentUser, children, name }: Props) => {
  const [loading, setLoading] = useState(false);
  const [respondBottomSheetIndex, setRespondBottomSheetIndex] = useAtom(respondBottomSheetIndexAtom);
  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [cancelling, isCancelling] = useState(false);

  const handleModalSheetOpen = () => {
    setRespondBottomSheetIndex(0);
    setSelectedProfile(name);
    setUserId(user.id)
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['user', name],
      exact: true
    });

    setRefreshing(false);
  }, []);

  const sendFriendRequest = async () => {
    setLoading(true);
    const res = await fetch(`${userBaseURL}/send/request/${user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['user', name],
        exact: true
      });

      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  const cancelRequest = async () => {
    isCancelling(true);
    const res = await fetch(`${userBaseURL}/cancel/request/${user.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['user', name],
        exact: true
      });
      setShowModal(false);
      isCancelling(false);
    }
  }

  return (
    <>
      <Modal style={{ backgroundColor: 'red', flex: 1 }} transparent visible={showModal}>
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: 'white', borderRadius: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, paddingHorizontal: 16, paddingVertical: 10 }}>Cancel friend request?</Text>
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
              }}
            />
            <TouchableHighlight style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 5}} activeOpacity={0.6} underlayColor="#DDDDDD" 
            onPress={() => !cancelling && cancelRequest()}>
              <View style={{flexDirection: 'row', gap: 5}}>
                { cancelling && <ActivityIndicator size={20} />}
                <Text style={{ paddingVertical: 5, color: '#0866FF' }}>{cancelling ? "Cancelling..." : "Cancel request"}</Text>
              </View>
            </TouchableHighlight>
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
              }}
            />
            <TouchableHighlight style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomLeftRadius: 10, borderBottomRightRadius: 10}} onPress={() => setShowModal(false)} activeOpacity={0.6} underlayColor="#DDDDDD">
              <Text style={{ color: '#0866FF', fontWeight: 'bold' }}>Close</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', position: 'relative', justifyContent: 'center' }}>
        <TouchableOpacity style={{ position: 'absolute', left: 0, zIndex: 100 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
          (other) {user.firstName} {user.lastName}
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        <Image source={user.coverPicture ? { uri: user.coverPicture } : require('../assets/gray_bg.jpg')} height={200} resizeMode="stretch" style={{ height: 200 }} />
        {/* <Image source={{uri: query.data?.profilePicture}} width={100} height={100} style={{borderRadius: 1000, position: 'absolute', bottom: -50}} /> */}
        <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
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
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }} onPress={sendFriendRequest}>
                                  <AntDesign name="adduser" size={16} color="white" />
                                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Add friend</Text>
                                </TouchableOpacity>
                              ) :
                              (
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 8, backgroundColor: '#0866FF', paddingHorizontal: 16, paddingVertical: 8 }} onPress={() => setShowModal(true)}>
                                  <MaterialCommunityIcons name="account-cancel-outline" size={16} color="white" />
                                  <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel request</Text>
                                </TouchableOpacity>
                              )
                          )
                      )
                  )
              }
            </View>
          </View>
        </View>
        {children}
      </ScrollView>
    </>
  )
}

export default OtherProfile;