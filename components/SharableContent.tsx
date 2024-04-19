import { View, Image, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { PostProps } from "../types";
import { generateDate, httpToHTTPS } from "../helpers";
import { Video, ResizeMode } from 'expo-av';
import Autolink from 'react-native-autolink';
// import Video from "react-native-video";

interface Props {
  post: PostProps,
  navigation: any
}

const SharableContent = ({ post, navigation }: Props) => {

  const goToProfile = () => {
    navigation.push('Profile', {
      screen: 'Posts',
      params: { name: `${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}` }
    });
  }

  const viewPost = () => {
    navigation.navigate('Post', {
      post: post.content
    });
  }

  return (
    !post.content ?
      (
        post.featureImage &&
        (
          post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4' ?
            (
              <Video source={{ uri: `https${post.featureImage.substring(post.featureImage.indexOf(':'))}` }} isLooping useNativeControls
                style={{ height: 400 }} resizeMode={ResizeMode.STRETCH} />
            ) :
            (
              <Image source={{ uri: httpToHTTPS(post.featureImage) }} height={500} resizeMode="stretch" />
            )
        )
      ) :
      (
        <View style={{ marginHorizontal: 16, borderWidth: .90, borderColor: 'gray', paddingVertical: 5, borderRadius: 8 }}>
          <TouchableWithoutFeedback onPress={viewPost}>
            <View style={{ paddingHorizontal: 16, display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 5 }}>
              <TouchableOpacity onPress={goToProfile}>
                <Image source={post.content.author.profilePicture ? { uri: post.content.author.profilePicture } : require('../assets/placeholder.jpg')} width={30} height={30} style={{ borderRadius: 1000, width: 30, height: 30 }} />
              </TouchableOpacity>
              <View>
                <TouchableOpacity onPress={goToProfile}>
                  <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
                    {post.content.author.firstName} {post.content.author.lastName}
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: 'gray', fontSize: 9 }}>
                  {generateDate(post.content.createdAt)}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
          <View style={{ paddingHorizontal: 16, marginBottom: 5 }}>
            <Autolink text={post.content.description} url
              renderText={
                (text) => <Text style={{ fontSize: 15 }}>{text}</Text>
              } linkStyle={{ color: '#0000EE', fontSize: 15 }} />
          </View>
          {
            post.content.featureImage &&
            (
              post.content.featureImage.substring(post.content.featureImage.lastIndexOf('.')) === '.mp4' ?
                (
                  <Video source={{ uri: `https${post.content.featureImage.substring(post.content.featureImage.indexOf(':'))}` }} isLooping useNativeControls
                    style={{ height: 400 }} resizeMode={ResizeMode.STRETCH} />
                  // <Video source={{ uri: `https${post.content.featureImage.substring(post.content.featureImage.indexOf(':'))}` }} />

                ) :
                (
                  <Image source={{ uri: httpToHTTPS(post.content.featureImage) }} height={400} resizeMode="stretch" />
                )
            )
          }
        </View>
      )
  )
}

export default SharableContent;