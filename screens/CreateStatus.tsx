import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useAtom } from "jotai";
import { currentUserAtom } from "../store";
import { useState } from "react";
import Loader from "../components/Loader";
import { userBaseURL } from "../env";
import * as SecureStore from 'expo-secure-store';
import ErrorModal from "../components/ErrorModal";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  navigation: any
}

const CreateStatus = ({ navigation }: Props) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const [status, setStatus] = useState("");
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handlePost = async () => {
    isLoading(true);
    const formdata: any = new FormData();
    formdata.append('description', status);
    
    const res = await fetch(`${userBaseURL}/add/post`, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${await SecureStore.getItemAsync('token')}`
      },
      body: formdata
    });

    const data = await res.json();

    if (!data.status) {
      isLoading(false);
      setError("Something went wrong");
    } else {
      await queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: true
      });
      
      navigation.goBack();
    }
  }

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      {/**Show loader when user posts */}
      <Loader isVisible={loading} message="Posting, please wait..." />
      {/** END */}
      {/** Show any error message */}
      <ErrorModal isVisible={error ? true : false} errorMessage={error} handleClose={() => setError("")} />
      {/** END */}
      <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#E4E5E7'}}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{position: 'absolute', left: 16}}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{fontWeight: 'bold', fontSize: 15}}>
          Create post
        </Text>
        <TouchableHighlight style={{position: 'absolute', right: 16, borderRadius: 6, backgroundColor: status ? '#0866FF' : 'gray', padding: 6}} onPress={handlePost} 
        activeOpacity={0.6}>
          <Text style={{color: status ? 'white' : '#D3D3D3', fontWeight: 'bold'}}>Post</Text>
        </TouchableHighlight>
      </View>
      <ScrollView style={{backgroundColor: 'white', paddingHorizontal: 16}}>
        <View style={{flexDirection: 'row', gap: 5, paddingVertical: 8}}>
          <Image source={currentUser?.profilePicture ? { uri: currentUser.profilePicture } : require('../assets/placeholder.png')} width={30} height={30} style={{width: 30, height: 30, borderRadius: 1000}} />
          <Text style={{fontWeight: 'bold'}}>{currentUser?.firstName} {currentUser?.lastName}</Text>
        </View>
        <TextInput placeholder="What's on your mind?" multiline onChangeText={(text) => setStatus(text) } />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CreateStatus;