import { SafeAreaView, View, TouchableOpacity, Image, Text, ScrollView, TouchableHighlight } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { PostProps } from "../types";
import { generateDate } from "../helpers";
import SharableContent from "../components/SharableContent";

interface Props {
  route: any,
  navigation: any
}

const Post = ({ route, navigation }: Props) => {
  const post: PostProps = route.params.post;

  const goToProfile = () => {
    navigation.push('Profile', {
      screen: 'Posts',
      params: { name: `${post.author.firstName}.${post.author.lastName}.${post.author.id}` }
    });
  }

  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <View style={{ flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <TouchableHighlight onPress={goToProfile} activeOpacity={0.6} style={{borderRadius: 1000}}>
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
      </ScrollView>
    </SafeAreaView>
  )
}

export default Post;