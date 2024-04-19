import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMemo, useCallback } from "react";
import { ActivityIndicator, Image, ScrollView, Text, View } from "react-native";
import { publicBaseURL } from "../env";
import { useQuery } from "@tanstack/react-query";
import { LikeProps } from "../types";

const ViewLikes = ({ bottomSheetRef, likes, postId }: { bottomSheetRef: any, likes?: number, postId: number }) => {
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []
  )

  const getLikesByPostId = async (): Promise<LikeProps[]> => {
    const res = await fetch(`${publicBaseURL}/like/post/${postId}`);
    const data = await res.json();
    return data.data;
  }

  const query = useQuery({
    queryKey: ['likes', postId],
    queryFn: getLikesByPostId
  });

  return (
    <BottomSheet snapPoints={snapPoints} index={-1} enablePanDownToClose backdropComponent={renderBackdrop} ref={bottomSheetRef}>
      <View style={{ marginHorizontal: 8, borderBottomWidth: 0.5, paddingBottom: 5 }}>
        <Text style={{ color: '#0866FF' }}>All {likes}</Text>
      </View>
      <BottomSheetScrollView style={{ marginHorizontal: 8 }}>
        {
          query.isPending ?
            (
              <ActivityIndicator size={30} />
            ) :
            (
              query.data &&
              (
                query.data.length === 0 ?
                  (
                    <Text style={{paddingVertical: 8}}>No likes yet</Text>
                  ) :
                  (
                    query.data.map((e, idx) => {
                      return (
                        <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 }}>
                          <Image source={e.user.profilePicture ? { uri: e.user.profilePicture } : require('../assets/placeholder.jpg')} width={35} height={35}
                            style={{ width: 35, height: 35, borderRadius: 1000 }} />
                          <Text style={{ fontWeight: '400' }}>{e.user.firstName} {e.user.lastName}</Text>
                        </View>
                      )
                    })
                  )
              )
            )
        }
      </BottomSheetScrollView>
    </BottomSheet>
  )
}

export default ViewLikes;