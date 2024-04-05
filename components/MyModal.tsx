import { View } from "react-native";

const MyModal = ({ children }: { children: React.ReactNode }) => {
    return (
        <View style={{position: 'absolute', height: '100%', width: '100%', zIndex: 1000, paddingVertical: 20, paddingHorizontal: 16, backgroundColor: 'rgba(0, 0, 0, 0.4)', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {children}
        </View>
    )
}

export default MyModal;