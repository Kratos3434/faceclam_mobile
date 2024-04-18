import { ActivityIndicator, SafeAreaView, Text, View, TouchableHighlight } from "react-native"
import ProfileLayout from "./ProfileLayout";
import { useState } from "react";
import { UserProps } from "../types";
import { publicBaseURL } from "../env";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Friends from "../components/Friends";

interface Props {
  navigation: any,
  route: any
}

const Posts = ({ route, navigation }: Props) => {
  const queryClient = useQueryClient();

  const { name } = route.params;

  const [user, setUser] = useState<UserProps>();
  const cache = queryClient.getQueryData<UserProps>(['user', name]);

  const friendsLimit = 6;

  const getFriends = async () => {
    const res = await fetch(`${publicBaseURL}/friends/limit?userId=${name.split('.')[2]}&limit=${friendsLimit}`);
    const data = await res.json();
    return data.data;
  }

  const seeAllFriends = () => {
    navigation.push('Profile', {
      screen: 'Friends',
      params: { name }
    });
  }

  const query = useQuery({
    queryKey: ['friends', name],
    queryFn: getFriends
  });

  if (query.status === 'pending') {
    return (
      <SafeAreaView>
        <ActivityIndicator size={70} />
      </SafeAreaView>
    )
  }

  return (
    <ProfileLayout navigation={navigation} setUser={setUser} name={name}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Friends</Text>
        <Text style={{ fontSize: 13, color: 'gray' }}>{cache ? cache?.friends.length : user?.friends.length} friends</Text>
        <Friends friends={query.data} currentId={cache ? cache?.id : user?.id} navigation={navigation} />
        <TouchableHighlight style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#D3D3D3', borderRadius: 6, paddingVertical: 7, marginTop: 5 }} onPress={seeAllFriends} activeOpacity={0.6} underlayColor='rgb(156 163 175)'>
          <Text style={{fontWeight: 'bold'}}>See all friends</Text>
        </TouchableHighlight>
      </View>
    </ProfileLayout>
  )
}

export default Posts;