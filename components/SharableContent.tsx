import { View, Image, Text, TouchableOpacity } from "react-native";
import { PostProps } from "../types";
import { generateDate } from "../helpers";
import { Video, ResizeMode, Audio } from 'expo-av';
import { useAtom } from "jotai";
import { selectedProfileAtom } from "../store";
import { useEffect } from "react";
// import Video from "react-native-video";

interface Props {
  post: PostProps,
  navigation: any
}

const SharableContent = ({ post, navigation }: Props) => {
  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);

  const goToProfile = () => {
    setSelectedProfile(`${post.content?.author.firstName}.${post.content?.author.lastName}.${post.content?.author.id}`);
    navigation.push('Profile');
  }

  return (
    !post.content ?
      (
        post.featureImage &&
        (
          post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4' ?
            (
              <Video source={{ uri: `https${post.featureImage.substring(post.featureImage.indexOf(':'))}` }} isLooping  useNativeControls 
              style={{height: 400}} resizeMode={ResizeMode.STRETCH} />
            ) :
            (
              <Image source={{ uri: post.featureImage }} height={500} />
            )
        )
      ) :
      (
        <View style={{marginHorizontal: 16, borderWidth: .90, borderColor: 'gray', paddingVertical: 5, borderRadius: 8}}>
          <View style={{paddingHorizontal: 16, display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 5}}>
            <TouchableOpacity onPress={goToProfile}>
              <Image source={post.content.author.profilePicture ? {uri: post.content.author.profilePicture} : require('../assets/placeholder.png')} width={25} height={25} style={{borderRadius: 1000, width: 25, height: 25}} />
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={goToProfile}>
                <Text style={{ fontWeight: 'bold', fontSize: 13 }}>
                  {post.content.author.firstName} {post.content.author.lastName}
                </Text>
              </TouchableOpacity>
              <Text style={{color: 'gray', fontSize: 9}}>
                {generateDate(post.content.createdAt)}
              </Text>
            </View>
          </View>
          <Text style={{paddingHorizontal: 16, fontSize: 13, marginBottom: 3}}>
            {post.content.description}
          </Text>
          {
            post.content.featureImage &&
            (
              post.content.featureImage.substring(post.content.featureImage.lastIndexOf('.')) === '.mp4' ?
                (
                  <Video source={{uri: `https${post.content.featureImage.substring(post.content.featureImage.indexOf(':'))}`}}  isLooping  useNativeControls 
                  style={{height: 400}} resizeMode={ResizeMode.STRETCH} shouldPlay={true} />
                  // <Video source={{ uri: `https${post.content.featureImage.substring(post.content.featureImage.indexOf(':'))}` }} />

                ) :
                (
                  <Image source={{ uri: post.content.featureImage }} height={400} />
                )
            )
          }
        </View>
      )
  )
}

export default SharableContent;