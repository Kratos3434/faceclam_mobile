import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { View, Text } from 'react-native';
import { useMemo, useCallback } from 'react';
import { useAtom } from 'jotai';
import { respondBottomSheetIndexAtom } from '../store';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TouchableHighlight } from 'react-native-gesture-handler';

const RespondBottomSheet = () => {
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const [respondBottomSheet, setRespondBottomSheet] = useAtom(respondBottomSheetIndexAtom);

  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} onPress={() => setRespondBottomSheet(-1)} />,
    []
  )

  const handleConfirm = async () => {

  }

  const handleDelete = async () => {
    
  }
  return (
    <BottomSheet snapPoints={snapPoints} enablePanDownToClose backgroundStyle={{ backgroundColor: 'white' }} backdropComponent={renderBackdrop} index={respondBottomSheet} onClose={() => setRespondBottomSheet(-1)}>
      <View>
        <TouchableHighlight style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }} activeOpacity={0.6} underlayColor="#DDDDDD" onPress={handleConfirm}>
          {/* <View style={{ borderRadius: 1000, backgroundColor: '#E4E5E7', padding: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="user-check" size={20} color="black" />
          </View>
          <Text style={{ fontSize: 15, fontWeight: '600' }}>Confirm</Text> */}
          <HighlightComponent icon={<Feather name="user-check" size={20} color="black" />} text='Confirm' />
        </TouchableHighlight>
        <TouchableHighlight style={{ flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 10, paddingHorizontal: 16 }} activeOpacity={0.6} underlayColor="#DDDDDD" onPress={handleDelete}>
          {/* <View style={{ borderRadius: 1000, backgroundColor: '#E4E5E7', padding: 7, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <AntDesign name="close" size={20} color="black" />
          </View>
          <Text style={{ fontSize: 15, fontWeight: '600' }}>Delete</Text> */}
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