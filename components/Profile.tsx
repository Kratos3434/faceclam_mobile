import { View, TouchableOpacity, Text, Image, ScrollView, RefreshControl } from "react-native";
import { UserProps } from "../types";
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { httpToHTTPS } from "../helpers";
import Header from "./Header";

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
      <Header navigation={navigation} heading={`${user.firstName} ${user.lastName}`} />
      <ScrollView style={{ flex: 1 }} refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      } showsVerticalScrollIndicator={false}>
        <Image source={user.coverPicture ? { uri: httpToHTTPS(user.coverPicture) } : require('../assets/gray_bg.jpg')} height={200} resizeMode="stretch" style={{ height: 200 }} />
        {/* <Image source={{uri: query.data?.profilePicture}} width={100} height={100} style={{borderRadius: 1000, position: 'absolute', bottom: -50}} /> */}
        <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
          <Image source={user.profilePicture ? { uri: httpToHTTPS(user.profilePicture) } : require('../assets/placeholder.jpg')} width={150} height={150} style={{ borderRadius: 1000, position: 'absolute', bottom: user.bio ? 70 : 50, left: 8, borderWidth: 3, borderColor: 'white', width: 150, height: 150 }} />
          <View style={{ paddingTop: 25, paddingBottom: 5 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
              {user.firstName} {user.lastName}
            </Text>
            <View style={{ flexDirection: 'row', gap: 3, marginBottom: 5 }}>
              <Text style={{ fontWeight: 'bold' }}>{user.friends.length}</Text>
              <Text style={{ color: 'gray' }}>friends</Text>
            </View>
            {user.bio && <Text>{user.bio}</Text>}
          </View>
        </View>
        {children}
      </ScrollView>
    </>
  )
}

export default Profile;