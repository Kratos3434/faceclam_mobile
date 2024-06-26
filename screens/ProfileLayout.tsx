import { SafeAreaView, Text, ActivityIndicator, View, TouchableHighlight } from "react-native";
import { styles } from "../styles";
import { useAtom } from "jotai";
import { currentUserAtom } from "../store";
import { useQuery } from "@tanstack/react-query";
import { publicBaseURL, userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import { UserProps } from "../types";
import Profile from "../components/Profile";
import OtherProfile from "../components/OtherProfile";
import React from "react";
import { useRoute } from "@react-navigation/native";

const ProfileLayout = ({ navigation, children, setUser, name }: { navigation: any, children: React.ReactNode, setUser: any, name: any }) => {
  const [currentUser, getCurrentUser] = useAtom(currentUserAtom);

  const route = useRoute();

  const getUser = async (): Promise<UserProps> => {
    const res = await fetch(`${publicBaseURL}/user/${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${await SecureStore.getItemAsync('token')}`
      }
    });

    const data = await res.json();
    setUser(data.data);
    return data.data;
  }

  const validateCurrent = async (): Promise<boolean> => {
    const res = await fetch(`${userBaseURL}/validate/current/${name}`, {
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
    queryKey: ['user', name],
    queryFn: getUser,
    staleTime: Infinity
  });

  const validate = useQuery({
    queryKey: ['validate', name],
    queryFn: validateCurrent,
    staleTime: Infinity
  });

  if (query.status === 'pending' || validate.status === 'pending') {
    return (
      <SafeAreaView>
        <ActivityIndicator size={70} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>

      {
        query.data &&
        (
          <>
            {
              validate.data ?
                (<Profile user={query.data} navigation={navigation} name={name}>
                  <View style={{ backgroundColor: '#E4E5E7', paddingVertical: 5 }}>
                    <View style={{ backgroundColor: 'white', paddingVertical: 10 }}>
                      <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 10, borderBottomWidth: 0.5, paddingBottom: 5 }}>
                        <TouchableHighlight style={{ backgroundColor: route.name === 'Posts' ? '#CDE0EA' : undefined, borderRadius: 100, paddingHorizontal: 7, paddingVertical: 5 }} onPress={() => navigation.navigate('Profile', {
                          screen: 'Posts',
                          params: { name }
                        })} activeOpacity={0.6} underlayColor="#DDDDDD" >
                          <Text style={{ color: route.name === 'Posts' ? 'blue' : 'black' }}>Posts</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={{ backgroundColor: route.name === 'Photos' ? '#CDE0EA' : undefined, borderRadius: 100, paddingHorizontal: 7, paddingVertical: 5 }} onPress={() => navigation.navigate('Profile', {
                          screen: 'Photos',
                          params: { name }
                        })} activeOpacity={0.6} underlayColor="#DDDDDD" >
                          <Text style={{ color: route.name === 'Photos' ? 'blue' : 'black' }}>Photos</Text>
                        </TouchableHighlight>
                      </View>
                      {children}
                    </View>
                  </View>
                </Profile>
                ) :
                (
                  <OtherProfile user={query.data} navigation={navigation} currentUser={currentUser} name={name}>
                    <View style={{ backgroundColor: '#E4E5E7', paddingVertical: 5 }}>
                      <View style={{ backgroundColor: 'white', paddingVertical: 10 }}>
                        <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 10, borderBottomWidth: 0.5, paddingBottom: 5 }}>
                          <TouchableHighlight style={{ backgroundColor: route.name === 'Posts' ? '#CDE0EA' : undefined, borderRadius: 100, paddingHorizontal: 7, paddingVertical: 5 }} onPress={() => navigation.navigate('Profile', {
                            screen: 'Posts',
                            params: { name }
                          })} activeOpacity={0.6} underlayColor="#DDDDDD" >
                            <Text style={{ color: route.name === 'Posts' ? 'blue' : 'black' }}>Posts</Text>
                          </TouchableHighlight>
                          <TouchableHighlight style={{ backgroundColor: route.name === 'Photos' ? '#CDE0EA' : undefined, borderRadius: 100, paddingHorizontal: 7, paddingVertical: 5 }} onPress={() => navigation.navigate('Profile', {
                            screen: 'Photos',
                            params: { name }
                          })} activeOpacity={0.6} underlayColor="#DDDDDD" >
                            <Text style={{ color: route.name === 'Photos' ? 'blue' : 'black' }}>Photos</Text>
                          </TouchableHighlight>
                        </View>
                        {children}
                      </View>
                    </View>
                  </OtherProfile>
                )
            }
            {/* <View style={{ backgroundColor: '#E4E5E7', paddingVertical: 5 }}>
                <View style={{ backgroundColor: 'white', paddingVertical: 10 }}>
                  <View style={{ marginHorizontal: 16, flexDirection: 'row', gap: 10, borderBottomWidth: 0.5, paddingBottom: 5 }}>
                    <TouchableHighlight style={{ backgroundColor: '#CDE0EA', borderRadius: 100, paddingHorizontal: 7, paddingVertical: 5 }} onPress={() => navigation.navigate('Posts')} activeOpacity={0.6} underlayColor="#DDDDDD" >
                      <Text style={{ color: 'blue' }}>Posts</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{ backgroundColor: '#CDE0EA', borderRadius: 100, paddingHorizontal: 7, paddingVertical: 5 }} onPress={() => navigation.navigate('Photos')} activeOpacity={0.6} underlayColor="#DDDDDD" >
                      <Text style={{ color: 'blue' }}>Photos</Text>
                    </TouchableHighlight>
                  </View>
                  {children}
                </View>
              </View> */}
          </>
        )
      }

    </SafeAreaView>
  )
}

export default ProfileLayout;