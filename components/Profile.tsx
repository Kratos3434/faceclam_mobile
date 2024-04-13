import { View, TouchableOpacity, Text, Image, ScrollView, RefreshControl } from "react-native";
import { UserProps } from "../types";
import { Ionicons } from '@expo/vector-icons'
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  user: UserProps,
  navigation: any,
  children: React.ReactNode,
  name: any
}

const Profile = ({ user, navigation, children, name }: Props) => {
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['user', name],
      exact: true
    });

    setRefreshing(false);
  }, []);

  return (
    <>
      <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', position: 'relative', justifyContent: 'center' }}>
        <TouchableOpacity style={{ position: 'absolute', left: 0, zIndex: 100 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 16 }}>
          {user.firstName} {user.lastName}
        </Text>
      </View>
      <ScrollView style={{ flex: 1 }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } showsVerticalScrollIndicator={false}>
        <Image source={{ uri: user.coverPicture }} height={200} resizeMode="stretch" />
        {/* <Image source={{uri: query.data?.profilePicture}} width={100} height={100} style={{borderRadius: 1000, position: 'absolute', bottom: -50}} /> */}
        <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
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
        {children}
      </ScrollView>
    </>
  )
}

export default Profile;