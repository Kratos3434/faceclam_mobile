import { View } from "react-native";
import { FriendProps } from "../types";
import FriendsCard from "./FriendsCard";
import { Fragment } from "react";

interface Props {
  friends: FriendProps[],
  currentId?: number
}

const Friends = ({ friends, currentId }: Props) => {
  console.log(currentId)
  return (
    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: friends.length < 3 ? 'center' : 'space-between', alignItems: 'center', gap: 10, marginVertical: 15}}>
      {
        friends.map((e, idx) => {
          return (
            e.user.id === currentId ?
            (
              <Fragment key={idx}>
                <FriendsCard user={e.friend} />
              </Fragment>
            ):
            (
              <Fragment key={idx}>
                <FriendsCard user={e.user} />
              </Fragment>
            )
          )
        })
      }
    </View>
  )
}

export default Friends;