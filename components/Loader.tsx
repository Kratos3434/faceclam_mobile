import { ActivityIndicator, Modal, Text, View } from "react-native";

interface Props {
  isVisible?: boolean,
  message?: string
}

const Loader = ({ isVisible, message }: Props) => {
  return (
    <Modal style={{ backgroundColor: 'red', flex: 1 }} transparent visible={isVisible} >
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={50} />
        { message && <Text style={{color: 'white', marginVertical: 10}}>{message}</Text> }
      </View>
    </Modal>
  )
}

export default Loader;