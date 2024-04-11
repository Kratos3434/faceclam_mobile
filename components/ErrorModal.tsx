import { useState } from "react";
import { Modal, StyleSheet, Text, TouchableHighlight, View } from "react-native";

interface Props {
  isVisible?: boolean,
  errorMessage: string,
  handleClose: any
}

const ErrorModal = ({ isVisible, errorMessage, handleClose }: Props) => {
  const [visible, setVisible] = useState(isVisible);

  return (
    <Modal style={{ backgroundColor: 'red', flex: 1 }} transparent visible={isVisible}>
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', borderRadius: 6, width: 200 }}>
          <Text style={{ color: 'red', fontWeight: 'bold', textAlign: 'center', borderBottomWidth: 1, borderColor: '#bbb', paddingVertical: 8 }}>ERROR</Text>
          <Text style={{paddingVertical: 10, paddingHorizontal: 16, textAlign: 'center', fontSize: 13, borderBottomWidth: 1, borderColor: '#bbb'}}>{errorMessage}</Text>
          <TouchableHighlight style={{paddingVertical: 5, alignItems: 'center', borderBottomEndRadius: 6, borderBottomLeftRadius: 6}} onPress={handleClose} activeOpacity={0.6} underlayColor="#DDDDDD" >
            <Text style={{color: '#0866FF'}}>Close</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  )
}

export default ErrorModal;