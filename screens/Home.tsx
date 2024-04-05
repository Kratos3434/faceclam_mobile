import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, Text, View } from "react-native";
import { styles } from "../styles";
import Card from "../components/Card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { publicBaseURL } from "../env";
import { PostProps } from "../types";
import { Fragment } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "../store";
import WhatsOnYourMind from "../components/WhatsOnYourMind";
import { useState, useCallback } from "react";

const Home = ({ navigation }: { navigation: any }) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const getPosts = async (): Promise<PostProps[]> => {
    const res = await fetch(`${publicBaseURL}/post/limit?limit=${20}`);
    const data = await res.json();
    return data.data;
  }

  const query = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    queryClient.invalidateQueries({
      queryKey: ['posts'],
      exact: true
    });

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      {/* <StatusBar backgroundColor='white' /> */}
      <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
        <Text style={{ fontWeight: 'bold', color: '#0866FF', fontSize: 30 }}>faceclam</Text>
      </View>
      <ScrollView style={{ paddingVertical: 0 }} 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
        { currentUser && <WhatsOnYourMind user={currentUser} />}
        {
          query.status === 'pending' ?
            (
              <ActivityIndicator size={70} />
            ) :
            (
              query.data?.map((e, idx) => {
                return (
                  <Fragment key={idx}>
                    <Card post={e} navigation={navigation} />
                  </Fragment>
                );
              })
            )
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home;