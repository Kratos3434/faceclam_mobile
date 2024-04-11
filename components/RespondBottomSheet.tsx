import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native';
import { useMemo, useCallback, useState, useRef } from 'react';
import { useAtom } from 'jotai';
import { respondBottomSheetIndexAtom, userIdAtom, selectedProfileAtom } from '../store';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { userBaseURL } from '../env';
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';

const RespondBottomSheet = () => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const [respondBottomSheet, setRespondBottomSheet] = useAtom(respondBottomSheetIndexAtom);
  const [userId, setUserId] = useAtom(userIdAtom);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const queryClient = useQueryClient();
  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />,
    []
  )

  const handleConfirm = async (id: number) => {
    setLoadingRequest(true);
    const res = await fetch(`${userBaseURL}/friend/accept/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });
    const data = await res.json();

    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['user', selectedProfile],
        exact: true
      });
      setLoadingRequest(false);
    } else {
      setLoadingRequest(false);
    }
  }

  const handleDelete = async (id: number) => {
    setLoadingRequest(true);
    const res = await fetch(`${userBaseURL}/friend/decline/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();
    if (data.status) {
      await queryClient.invalidateQueries({
        queryKey: ['user', selectedProfile],
        exact: true
      });
      setLoadingRequest(false);
      bottomSheetRef.current?.close();
    } else {
      setLoadingRequest(false);
    }
  }

  return (
    <BottomSheet snapPoints={snapPoints} enablePanDownToClose backgroundStyle={{ backgroundColor: 'white' }} backdropComponent={renderBackdrop} index={respondBottomSheet} onClose={() => setRespondBottomSheet(-1)} ref={bottomSheetRef}>
      <View>
        <TouchableHighlight style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }} activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => !loadingRequest && handleConfirm(userId)}>
          <HighlightComponent icon={<Feather name="user-check" size={20} color="black" />} text='Confirm' />
        </TouchableHighlight>
        <TouchableHighlight style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }} activeOpacity={0.6} underlayColor="#DDDDDD" onPress={() => !loadingRequest && handleDelete(userId)}>
          <HighlightComponent icon={<AntDesign name="close" size={20} color="black" />} text='Delete' />
        </TouchableHighlight>
      </View>
    </BottomSheet>
  )
}

const HighlightComponent = ({ icon, text }: { icon: React.ReactNode, text: string }) => {
  return (
    <>
      <View style={{ borderRadius: 1000, backgroundColor: '#E4E5E7', padding: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </View>
      <Text style={{ fontSize: 15, fontWeight: '600' }}>{text}</Text>
    </>
  )
}

export default RespondBottomSheet;