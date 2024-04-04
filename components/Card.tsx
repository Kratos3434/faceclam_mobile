import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather, AntDesign, FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { PostProps } from "../types";
import { generateDate } from "../helpers";
import Video from 'react-native-video';

interface Props {
  post: PostProps
}

const Card = ({ post }: Props) => {
  return (
    <View style={{ backgroundColor: 'white', display: 'flex', paddingVertical: 8, marginBottom: 5 }}>
      <View style={{ paddingHorizontal: 16, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image source={{ uri: post.author.profilePicture }} width={35} height={35} style={{ borderRadius: 1000 }} />
          <View style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={{ fontWeight: 'bold' }}>{post.author.firstName} {post.author.lastName}</Text>
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
      {/**Description */}
      <Text style={{ paddingHorizontal: 16, fontSize: 13, marginVertical: 3 }}>{post.description}</Text>
      {/**Description */}
      {/**Image */}
      {
        post.featureImage &&
        (
          post.featureImage.substring(post.featureImage.lastIndexOf('.')) === '.mp4' ?
          (
            <Video source={{uri: `https${post.featureImage.substring(post.featureImage.indexOf(':'))}`}} />
          ):
          (
            <Image source={{ uri: post.featureImage }} height={500} />
          )
        )
      }
      {/**Image */}
      <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 5 }}>
        <Text style={{ color: 'gray' }}>
          {post.likes.length} likes
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
      <View
        style={{
          borderBottomColor: 'gray',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginHorizontal: 16
        }}
      />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, alignItems: 'center', marginVertical: 5 }}>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <AntDesign name="like2" size={20} color="black" />
          <Text style={{ color: 'gray', fontSize: 13 }}>Like</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <FontAwesome name="comment-o" size={20} color="black" />
          <Text style={{ color: 'gray', fontSize: 13 }}>Comment</Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <FontAwesome5 name="share" size={20} color="black" />
          <Text style={{ color: 'gray', fontSize: 13 }}>Share</Text>
        </View>
      </View>
    </View>
  );
}

export default Card;