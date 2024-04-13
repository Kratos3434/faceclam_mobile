import { View, Image, Text, TouchableOpacity, StyleSheet, TouchableHighlight, TouchableWithoutFeedback } from "react-native";
import { Feather, AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { PostProps } from "../types";
import { generateDate } from "../helpers";
import SharableContent from "./SharableContent";
import { useAtom } from "jotai";
import { currentUserAtom } from "../store";
import { useState } from "react";
import { userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import Autolink from 'react-native-autolink';


interface Props {
  post: PostProps,
  navigation: any
}

const Card = ({ post, navigation }: Props) => {
  const [currentUser, setCurrent] = useAtom(currentUserAtom);
  const [isLiked, setIsLiked] = useState(post.likes.some(e => e.userId === currentUser?.id));
  const [likes, setLikes] = useState(post.likes.length);
  const [handlingLike, setHandlingLike] = useState(false);

  const goToProfile = () => {
    navigation.push('Profile', {
      screen: 'Posts',
      params: { name: `${post.author.firstName}.${post.author.lastName}.${post.author.id}` }
    });
  }

  const viewPost = () => {
    navigation.navigate('Post', {
      post: post
    });
  }

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

    !handlingLike && await likePost();
  }

  return (
    <View style={{ backgroundColor: 'white', display: 'flex', paddingTop: 8, marginBottom: 5 }}>
      <TouchableWithoutFeedback onPress={viewPost}>
        <View style={{ paddingHorizontal: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity onPress={goToProfile}>
              <Image source={post.author.profilePicture ? { uri: post.author.profilePicture } : require('../assets/placeholder.png')} width={40} height={40} style={{ borderRadius: 1000, width: 40, height: 40 }} />
            </TouchableOpacity>
            <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <TouchableOpacity onPress={goToProfile}>
                <Text style={{ fontWeight: 'bold' }}>{post.author.firstName} {post.author.lastName}</Text>
              </TouchableOpacity>
              <Text style={{ color: 'gray', fontSize: 11 }}>{generateDate(post.createdAt)}</Text>
            </View>
          </View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity>
              <Feather name="more-horizontal" size={20} color="black" />
            </TouchableOpacity>
            <TouchableOpacity>
              <AntDesign name="close" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {/**Description */}
      {/* <Text style={{ paddingHorizontal: 16, fontSize: 15, marginVertical: 8 }}>{post.description}</Text> */}
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <Autolink text={post.description} url
          renderText={ 
            (text) => <Text style={{ fontSize: 15 }}>{text}</Text>
          } linkStyle={{ color: '#0000EE', fontSize: 15 }} />
      </View>
      {/**Description */}
      {/**Image */}
      <SharableContent post={post} navigation={navigation} />
      {/**Image */}
      <TouchableWithoutFeedback onPress={viewPost}>
        <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 5 }}>
          <Text style={{ color: 'gray' }}>
            {likes} likes
          </Text>
          <View style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
            <Text style={{ color: 'gray' }}>
              {post.comments.length} comments
            </Text>
            <Text style={{ color: 'gray' }}>
              {post.shares.length} shares
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          borderBottomColor: 'gray',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginHorizontal: 16
        }}
      />
      <TouchableWithoutFeedback onPress={viewPost}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, alignItems: 'center', marginVertical: 8 }}>
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
      </TouchableWithoutFeedback>
    </View>
  );
}

export default Card;