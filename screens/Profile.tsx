import { SafeAreaView, Text, ActivityIndicator, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { styles } from "../styles";
import { useAtom } from "jotai";
import { selectedProfileAtom } from "../store";
import { useQuery } from "@tanstack/react-query";
import { publicBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import { UserProps } from "../types";
import { Ionicons } from '@expo/vector-icons';


const Profile = ({ navigation }: { navigation: any }) => {
  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);

  const getUser = async (): Promise<UserProps> => {
    const res = await fetch(`${publicBaseURL}/user/${selectedProfile}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();
    return data.data;
  }

  const query = useQuery({
    queryKey: ['user', selectedProfile],
    queryFn: getUser
  });

  return (
    <View style={styles.AndroidSafeArea}>
      {
        query.status === 'pending' ?
          (
            <ActivityIndicator size={70} />
          ) :
          (
            <>
              <View style={{ backgroundColor: 'white', flexDirection: 'row', paddingVertical: 10, alignItems: 'center', position: 'relative', justifyContent: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', left: 0, zIndex: 100 }} onPress={() => navigation.goBack()}>
                  <Ionicons name="chevron-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold' }}>
                  {query.data?.firstName} {query.data?.lastName}
                </Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                <Image source={{ uri: query.data?.coverPicture }} height={200} resizeMode="stretch" />
                {/* <Image source={{uri: query.data?.profilePicture}} width={100} height={100} style={{borderRadius: 1000, position: 'absolute', bottom: -50}} /> */}
                <View style={{ paddingHorizontal: 16, backgroundColor: 'white', position: 'relative' }}>
                  <Image source={{ uri: query.data?.profilePicture }} width={120} height={120} style={{ borderRadius: 1000, position: 'absolute', bottom: 50, left: 8, borderWidth: 3, borderColor: 'white' }} />
                  <View style={{paddingTop: 25}}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginTop: 10 }}>
                      {query.data?.firstName} {query.data?.lastName}
                    </Text>
                    <View style={{flexDirection: 'row', gap: 3, marginBottom: 5}}>
                      <Text style={{fontWeight: 'bold'}}>0</Text>
                      <Text style={{color: 'gray'}}>friends</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </>
          )
      }
    </View>
  )
}

export default Profile;