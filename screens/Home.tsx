import { ActivityIndicator, FlatList, Platform, RefreshControl, SafeAreaView, Text, View } from "react-native";
import Card from "../components/Card";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { publicBaseURL } from "../env";
import { PostProps } from "../types";
import { useAtom } from "jotai";
import { currentUserAtom, lastCreatedAtom, likesAtom } from "../store";
import WhatsOnYourMind from "../components/WhatsOnYourMind";
import { useState, useCallback, useMemo } from "react";
import { StatusBar } from "react-native";
import { styles } from "../styles";

const Home = ({ navigation }: { navigation: any }) => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [refreshing, setRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const [lastCreated, setLastCreated] = useAtom(lastCreatedAtom);
  const [likes, setLikes] = useAtom(likesAtom);

  const limit = 5;

  const getPosts = async ({ pageParam }: { pageParam: string }): Promise<{
    data: PostProps[],
    currentPage: string,
    nextPage: string | null
  }> => {
    let fetchSum = "";

    if (!pageParam) {
      fetchSum = `${publicBaseURL}/post/limit?limit=${limit}`;
    } else {
      fetchSum = `${publicBaseURL}/post/limit?limit=${limit}&lastCreatedAt=${lastCreated}`
    }

    const res = await fetch(fetchSum);
    const data = await res.json();

    if (data.status) {
      data.data.map((e: PostProps) => {
        likes.set(e.id, e.likes);
        if (e.content) {
          likes.set(e.content.id, e.content.likes);
        }
      })
    }

    if (data.data.length == limit) {
      setLastCreated(data.data[data.data.length - 1].createdAt);
    } else {
      setLastCreated(null);
    }

    return {
      data: data.data,
      currentPage: pageParam,
      nextPage: lastCreated
    }
  }

  const query = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextPage,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.resetQueries({
      queryKey: ['posts'],
      exact: true
    });

    setRefreshing(false);
  }, []);

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'} />
      <View style={{ paddingHorizontal: 16, backgroundColor: 'white', marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold', color: '#0866FF', fontSize: 30 }}>faceclam</Text>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: 'white' }}
        data={query.data?.pages}
        renderItem={({ item }) => {
          return <FlatList data={item.data} style={{ backgroundColor: '#E4E5E7' }} renderItem={({ item }) => {
            if (query.isSuccess) {
              return <Card post={item} navigation={navigation} />
            }
            return <ActivityIndicator size={70} />
          }} />
        }}
        ListFooterComponent={() => {
          return (
            query.hasNextPage ? <ActivityIndicator style={{ paddingVertical: 5, backgroundColor: '#E4E5E7' }} size={20} /> :
              (
                !query.isPending && <Text style={{ textAlign: 'center', marginVertical: 5 }}>You are updated :{")"}</Text>
              )
          )
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => { return currentUser && <WhatsOnYourMind user={currentUser} navigation={navigation} /> }}
        onEndReached={loadMore}
      />
    </SafeAreaView>
  )
}
// #D3D3D3
export default Home;