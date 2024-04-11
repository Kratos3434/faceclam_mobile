import { ActivityIndicator, Text, View } from "react-native"
import ProfileLayout from "./ProfileLayout";
import { useState } from "react";
import { UserProps } from "../types";
import { publicBaseURL } from "../env";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { selectedProfileAtom, userProfileAtom } from "../store";
import Friends from "../components/Friends";

interface Props {
  navigation: any,
}

const Posts = ({ navigation }: Props) => {
  const queryClient = useQueryClient();

  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);
  const [user, setUser] = useState<UserProps>();
  const cache = queryClient.getQueryData<UserProps>(['user', selectedProfile]);

  const friendsLimit = 6;

  const getFriends = async () => {
    const res = await fetch(`${publicBaseURL}/friends/limit?userId=${selectedProfile.split('.')[2]}&limit=${friendsLimit}`);
    const data = await res.json();
    return data.data;
  }

  const query = useQuery({
    queryKey: ['friends', selectedProfile],
    queryFn: getFriends
  });

  if (query.status === 'pending') {
    return <ActivityIndicator size={70} />
  }

  return (
    <ProfileLayout navigation={navigation} setUser={setUser}>
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Friends</Text>
        <Text style={{ fontSize: 13, color: 'gray' }}>{cache ? cache?.friends.length : user?.friends.length} friends</Text>
        <Friends friends={query.data} currentId={cache ? cache?.id : user?.id} />
      </View>
    </ProfileLayout>
  )
}

export default Posts;