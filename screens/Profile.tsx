import { SafeAreaView, Text, ActivityIndicator, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { styles } from "../styles";
import { useAtom } from "jotai";
import { currentUserAtom, selectedProfileAtom } from "../store";
import { useQuery } from "@tanstack/react-query";
import { publicBaseURL, userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import { UserProps } from "../types";
import Profile from "../components/Profile";
import OtherProfile from "../components/OtherProfile";


const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [selectedProfile, setSelectedProfile] = useAtom(selectedProfileAtom);
  const [currentUser, getCurrentUser] = useAtom(currentUserAtom);

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

  const validateCurrent = async (): Promise<boolean> => {
    const res = await fetch(`${userBaseURL}/validate/current/${selectedProfile}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();
    return data.status;
  }

  const query = useQuery({
    queryKey: ['user', selectedProfile],
    queryFn: getUser
  });

  const validate = useQuery({
    queryKey: ['validate', selectedProfile],
    queryFn: validateCurrent
  });

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      
      {
        query.status === 'pending' || validate.status == 'pending' ?
          (
            <ActivityIndicator size={70} />
          ) :
          (
            query.data && 
            (
              validate.data ?
              <Profile user={query.data} navigation={navigation} /> : <OtherProfile user={query.data} navigation={navigation} currentUser={currentUser} />
            )
          )
      }
    </SafeAreaView>
  )
}

export default ProfileScreen;