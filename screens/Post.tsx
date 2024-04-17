import { SafeAreaView, View, TouchableOpacity, Image, Text, ScrollView, TouchableHighlight, ActivityIndicator } from "react-native";
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { CommentProps, PostProps } from "../types";
import { generateDate } from "../helpers";
import SharableContent from "../components/SharableContent";
import { Fragment, useState, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { currentUserAtom, likesAtom } from "../store";
import { publicBaseURL } from "../env";
import { useQuery } from "@tanstack/react-query";
import Comment from "../components/Comment";
import { userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import { TextInput } from "react-native-gesture-handler";
interface Props {
  route: any,
  navigation: any
}

const Post = ({ route, navigation }: Props) => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const post: PostProps = route.params.post;
  const [l, setL] = useAtom(likesAtom);
  const currentUser = useAtomValue(currentUserAtom);
  const [isLiked, setIsLiked] = useState(l.get(post.id)?.some(e => e.userId === currentUser?.id));
  const [likes, setLikes] = useState(l.get(post.id)?.length);
  const [handlingLike, setHandlingLike] = useState(false);

  const goToProfile = () => {
    navigation.push('HomeTabs', {
      screen: 'Home',
      params: {
        screen: 'Profile',
        params: {
          screen: 'Posts',
          params: { name: `${post.author.firstName}.${post.author.lastName}.${post.author.id}` }
        }
      }
    });
  }

  const getCommentByPostId = async (): Promise<CommentProps[]> => {
    const res = await fetch(`${publicBaseURL}/comment/post/${post.id}`);
    const data = await res.json();
    return data.data;
  }

  const query = useQuery({
    queryKey: ['comments', post.id],
    queryFn: getCommentByPostId
  })

  const likePost = async () => {
    setHandlingLike(true);
    console.log('Liking post...');
    const res = await fetch(`${userBaseURL}/like/post/${post.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": 'application/json',
        'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();

    if (data.status) {
      if (post.author.email != currentUser?.email) {
        const notif = await fetch(`${userBaseURL}/notification/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
          },
          body: JSON.stringify({
            recipientId: post.author.id,
            postId: post.id,
            type: 'LIKE'
          })
        });

        if (notif.status === 200) {
          //emit notifications
        }
      }
      setHandlingLike(false);
    }
  }

  const handleLike = async () => {
    if (likes !== undefined) {
      switch (isLiked) {
        case true:
          setLikes(likes - 1);
          setIsLiked(false);
          break;
        case false:
          setLikes(likes + 1);
          setIsLiked(true);
          break;
      }
      if (isLiked) {
        let res = l.get(post.id);
        res = res?.filter(e => e.userId != currentUser?.id);
        if (res) {
          l.set(post.id, res);
          const newLikes = new Map(l);
          setL(newLikes);
        }
      } else {
        let res = l.get(post.id);
        if (currentUser) {
          res?.push({
            id: res.length > 0 ? res[res.length - 1].id + 1 : 1,
            post: post,
            postId: post.id,
            user: currentUser,
            userId: currentUser.id,
            createdAt: `${new Date()}`
          })
          if (res) {
            l.set(post.id, res);
            const newLikes = new Map(l);
            setL(newLikes);
          }
        }
      }
    }

    !handlingLike && await likePost();
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => {
            navigation.goBack()
            // navigation.push('HomeTabs');
          }}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableHighlight onPress={goToProfile} activeOpacity={0.6} style={{ borderRadius: 1000 }}>
              <Image source={post.author.profilePicture ? { uri: post.author.profilePicture } : require('../assets/placeholder.png')} width={30} height={30} style={{ borderRadius: 1000, width: 35, height: 35 }} />
            </TouchableHighlight>
            <View>
              <TouchableHighlight onPress={goToProfile} activeOpacity={0.6} underlayColor="#CDE0EA">
                <Text style={{ fontWeight: 'bold' }}>
                  {post.author.firstName} {post.author.lastName}
                </Text>
              </TouchableHighlight>
              <Text style={{ color: 'gray', fontSize: 10 }}>{generateDate(post.createdAt)}</Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <Text style={{ paddingHorizontal: 8 }}>{post.description}</Text>
        <View style={{ paddingVertical: 5 }}>
          <SharableContent post={post} navigation={navigation} />
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 8, alignItems: 'center' }}>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }} onPress={handleLike}>
            <AntDesign name="like2" size={20} color={isLiked ? "blue" : "black"} />
            <Text style={{ color: isLiked ? 'blue' : 'gray', fontSize: 13 }}>Like</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <FontAwesome name="comment-o" size={20} color="black" />
            <Text style={{ color: 'gray', fontSize: 13 }}>Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
            <FontAwesome5 name="share" size={20} color="black" />
            <Text style={{ color: 'gray', fontSize: 13 }}>Share</Text>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginVertical: 5 }} />
        <Text style={{ paddingHorizontal: 8, fontWeight: 'bold' }}>
          {likes} likes
        </Text>
        <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginVertical: 5 }} />
        <Text style={{ paddingHorizontal: 8, fontWeight: 'bold', fontSize: 13 }}>
          {post.shares.length} shares
        </Text>
        <View style={{ padding: 8 }}>
          {
            query.status === 'pending' ?
              (
                <ActivityIndicator size={30} />
              ) :
              (
                <View>
                  <Text>Comments</Text>
                  {
                    query.data?.length === 0 ?
                      (
                        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>No comments yet</Text>
                      ) :
                      (
                        query.data?.map((e, idx) => {
                          return (
                            <Fragment key={idx}>
                              <Comment comment={e} navigation={navigation} />
                            </Fragment>
                          )
                        })
                      )
                  }
                </View>
              )
          }
        </View>
      </ScrollView>
      <View style={{ paddingHorizontal: 8, paddingVertical: 5, borderTopWidth: 1, borderColor: 'rgba(0, 0, 0, 0.5)' }}>
        <View style={{backgroundColor: '#D3D3D3', borderRadius: 24, paddingHorizontal: 8, paddingVertical: 1}}>
          <TextInput multiline placeholder="Say something about this post" />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Post;          