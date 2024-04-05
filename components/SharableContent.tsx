import { View, Image, Text, TouchableOpacity } from "react-native";
import { PostProps } from "../types";
import { generateDate } from "../helpers";
import { Video, ResizeMode } from 'expo-av';
import { useAtom } from "jotai";
import { selectedProfileAtom } from "../store";
// import Video from "react-native-video";

interface Props {
  post: PostProps,
  navigation: any
}

const SharableContent = ({ post, navigation }: Props) => {
  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);

  const goToProfile = () => {
    setSelectedProfile(`${post.author.firstName}.${post.author.lastName}.${post.author.id}`);
    navigation.push('Profile');
  }

  return (
    !post.content ?
      (
        post.featureImage &&
        (
          post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4' ?
            (
              <Video source={{ uri: `https${post.featureImage.substring(post.featureImage.indexOf(':'))}` }} />
            ) :
            (
              <Image source={{ uri: post.featureImage }} height={500} />
            )
        )
      ) :
      (
        <View style={{marginHorizontal: 16, borderWidth: .90, borderColor: 'gray', paddingVertical: 5}}>
          <View style={{paddingHorizontal: 16, display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', marginBottom: 5}}>
            <TouchableOpacity onPress={goToProfile}>
              <Image source={{uri: post.content.author.profilePicture}} width={25} height={25} style={{borderRadius: 1000}} />
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
          {
            post.content.featureImage &&
            (
              post.content.featureImage.substring(post.content.featureImage.lastIndexOf('.')) === '.mp4' ?
                (
                  <Video source={{uri: `https${post.content.featureImage.substring(post.content.featureImage.indexOf(':'))}`}}  isLooping  useNativeControls 
                  style={{height: 400}} resizeMode={ResizeMode.STRETCH} />
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