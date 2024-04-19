import { ActivityIndicator, Image, RefreshControl, ScrollView, Text, TouchableWithoutFeedback, View } from "react-native";
import Header from "../components/Header";
import { PostProps, SavedProps } from "../types";
import { userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { httpToHTTPS } from "../helpers";
import { Video, ResizeMode } from 'expo-av';
import { useCallback, useState } from "react";
import { AntDesign } from '@expo/vector-icons';

interface Props {
  navigation: any
}

const Saved = ({ navigation }: Props) => {
  const imgDimensions = 60;
  const imgWidth = 80;
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const getSaved = async (): Promise<SavedProps[]> => {
    const res = await fetch(`${userBaseURL}/list/saved`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();

    return data.data;
  }

  const query = useQuery({
    queryKey: ['saved'],
    queryFn: getSaved,
  })

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.resetQueries({
      queryKey: ['saved'],
      exact: true
    });

    setRefreshing(false);
  }, []);

  const goToPost = (post: PostProps) => {
    navigation.push('Post', {
      post
    })
  }

  return (
    <>
      <Header navigation={navigation} heading="Saved items" />
      <Text style={{ fontWeight: 'bold', paddingHorizontal: 8, fontSize: 19, borderTopWidth: 0.5, borderTopColor: '#D3D3D3' }}>Saved items</Text>
      <ScrollView style={{ marginVertical: 15, paddingHorizontal: 8 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {
          query.isPending ?
            (
              <ActivityIndicator size={50} />
            ) :
            (
              query.data &&
              (
                query.data.length === 0 ?
                  (
                    <Text>No saved items</Text>
                  ) :
                  (
                    query.data.map((e, idx) => {
                      return (
                        <TouchableWithoutFeedback key={idx} onPress={() => goToPost(e.content)}>
                          <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 8 }}>
                            {
                              e.content.featureImage ?
                                (
                                  e.content.featureImage.substring(e.content.featureImage.lastIndexOf('.')) === '.mp4' ?
                                    (
                                      <View style={{position: 'relative'}}>
                                        <Video source={{ uri: httpToHTTPS(e.content.featureImage) }} style={{ height: imgDimensions, width: imgWidth, borderRadius: 10 }} resizeMode={ResizeMode.STRETCH} />
                                        <AntDesign name="playcircleo" size={24} color="white" style={{position: 'absolute', left: 28, bottom: 18}} />
                                      </View>
                                    ) :
                                    (
                                      <Image source={{ uri: httpToHTTPS(e.content.featureImage) }} width={imgWidth} height={imgDimensions} style={{ width: imgWidth, height: imgDimensions, borderRadius: 10 }} />
                                    )
                                ) :
                                (
                                  <Image source={e.content.author.profilePicture ? { uri: httpToHTTPS(e.content.author.profilePicture) } : require('../assets/placeholder.jpg')}
                                    width={imgWidth} height={imgDimensions} style={{ width: imgWidth, height: imgDimensions, borderRadius: 10 }} />
                                )
                            }
                            <Text style={{ fontWeight: 'bold' }}>{e.content.description}</Text>
                          </View>
                        </TouchableWithoutFeedback>
                      )
                    })
                  )
              )
            )
        }
      </ScrollView>
    </>
  )
}

export default Saved;