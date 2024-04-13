import { Image, Text, TouchableHighlight, View } from "react-native";
import { CommentProps } from "../types";

interface Props {
  comment: CommentProps
}

const Comment = ({ comment }: Props) => {

  const goToProfile = () => {
    // navigation.push('Profile', {
    //   screen: 'Posts',
    //   params: { name: `${comment.author.firstName}.${comment.author.lastName}.${comment.author.id}` }
    // });
  }

  return (
    <View style={{flexDirection: 'row', paddingVertical: 8, gap: 5}}>
      <TouchableHighlight onPress={goToProfile} activeOpacity={0.6} underlayColor="white">
        <Image source={comment.author.profilePicture ? { uri: comment.author.profilePicture }: require('../assets/placeholder.png')} 
      width={35} height={35} style={{borderRadius: 1000, width: 35, height: 35}} />
      </TouchableHighlight>
      <View style={{padding: 8, borderRadius: 16, backgroundColor: '#E4E5E7', width: '100%', maxWidth: 350}}>
        <Text style={{fontWeight: 'bold'}}>
          {comment.author.firstName} {comment.author.lastName}
        </Text>
        <Text>
          {comment.comment}
        </Text>
      </View>
    </View>
  )
}

export default Comment;