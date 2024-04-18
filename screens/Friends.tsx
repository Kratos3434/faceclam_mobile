import { Text, View, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView, RefreshControl } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { publicBaseURL } from "../env";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useCallback, useState } from "react";
import DisplayFriend from "../components/DisplayFriend";
import { FriendProps } from "../types";

interface Props {
  route: any,
  navigation: any
}


const Friends = ({ route, navigation }: Props) => {
  const name: string = route.params.name;
  const [firstName, lastName, id] = name.split('.');
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const getFriendsById = async (): Promise<FriendProps[]> => {
    const res = await fetch(`${publicBaseURL}/friends/${id}`);
    const data = await res.json();

    return data.data;
  }

  const query = useQuery({
    queryKey: ['AllFriends', name],
    queryFn: getFriendsById,
    staleTime: Infinity
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({
      queryKey: ['AllFriends', name],
      exact: true
    });

    setRefreshing(false);
  }, []);

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 10, position: 'relative' }}>
        <TouchableOpacity style={{ position: 'absolute', left: 0, zIndex: 100 }} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{firstName} {lastName}'s friends</Text>
      </View>
      <ScrollView style={{ paddingHorizontal: 8 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Friends list</Text>
        {
          query.status === 'pending' ?
            (
              <ActivityIndicator size={50} />
            ) :
            (
              query.data &&
              (
                <View style={{ paddingTop: 15 }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{query.data.length} friends</Text>
                  <View>
                    {
                      query.data.map((e, idx) => {
                        return (
                          <Fragment key={idx}>
                            {
                              e.userId.toString() == id ? <DisplayFriend user={e.friend} navigation={navigation} /> : <DisplayFriend user={e.user} navigation={navigation} />

                            }
                          </Fragment>
                        )
                      })
                    }
                  </View>
                </View>
              )
            )
        }
      </ScrollView>
    </>
  )
}

export default Friends;