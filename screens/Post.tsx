import { SafeAreaView, View, TouchableOpacity, Image, Text, ScrollView, TouchableHighlight, ActivityIndicator } from "react-native";
import { AntDesign, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { CommentProps, PostProps } from "../types";
import { generateDate } from "../helpers";
import SharableContent from "../components/SharableContent";
import { Fragment, useState, useMemo } from "react";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "../store";
import { publicBaseURL } from "../env";
import { useQuery } from "@tanstack/react-query";
import Comment from "../components/Comment";

interface Props {
  route: any,
  navigation: any
}

const Post = ({ route, navigation }: Props) => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const post: PostProps = route.params.post;
  const currentUser = useAtomValue(currentUserAtom);
  const [isLiked, setIsLiked] = useState(post.likes.some(e => e.userId === currentUser?.id));
  const [likes, setLikes] = useState(post.likes.length);

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

  const handleLike = async () => {
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

    // !handlingLike && await likePost();
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
        <Text style={{ paddingHorizontal: 8, fontWeight: 'bold'}}>
          {likes} likes
        </Text>
        <View style={{ borderBottomWidth: 1, borderColor: 'gray', marginVertical: 5 }} />
        <Text style={{ paddingHorizontal: 8, fontWeight: 'bold', fontSize: 13}}>
          {post.shares.length} shares
        </Text>
        <View style={{padding: 8}}>
          {
            query.status === 'pending' ?
            (
              <ActivityIndicator size={30} />
            ):
            (
              <View>
                <Text>Comments</Text>
                {
                  query.data?.length === 0 ?
                  (
                    <Text style={{fontSize: 12, fontWeight: 'bold'}}>No comments yet</Text>
                  ):
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
    </SafeAreaView>
  )
}

export default Post;          