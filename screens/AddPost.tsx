import { useState } from "react";
import { SafeAreaView, View, Text, TouchableHighlight, TouchableOpacity, Image, TextInput, ScrollView } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { useAtom } from "jotai";
import { currentUserAtom, selectedPhotoAtom } from "../store";
import * as SecureStore from 'expo-secure-store';
import Loader from "../components/Loader";
import { checkValidFileType } from "../helpers";
import { userBaseURL } from "../env";
import { useQueryClient } from "@tanstack/react-query";
import ErrorModal from "../components/ErrorModal";

interface Props {
  navigation: any
}

const AddPost = ({ navigation }: Props) => {
  const [status, setStatus] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useAtom(selectedPhotoAtom);
  const [user, setUser] = useAtom(currentUserAtom);
  const [loading, isLoading] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const handlePost = async () => {
    isLoading(true);
    if (selectedPhoto) {
      if (selectedPhoto.mimeType && !checkValidFileType(selectedPhoto.mimeType)) {
        setError("Invalid file type");
        isLoading(false);
        return false;
      }
    }

    const formdata: any = new FormData();
    formdata.append('description', status);
    formdata.append('featureImage', { 
      uri: selectedPhoto?.uri,
      type: selectedPhoto?.mimeType,
      name: selectedPhoto?.fileName
    });

    try {
      const res = await fetch(`${userBaseURL}/add/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await SecureStore.getItemAsync('token')}`
        },
        body: formdata
      });
  
      const data = await res.json();
  
      if (!data.status) {
        setError(data.error);
        setSelectedPhoto(null);
        isLoading(false);
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['posts']
        });
        setSelectedPhoto(null);
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
      setSelectedPhoto(null);
      setError("Something went wrong :(");
      isLoading(false);
    }
  }

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/**Show loader when user posts */}
      <Loader isVisible={loading} message="Posting, please wait..." />
      {/** END */}
      {/** Show any error message */}
      <ErrorModal isVisible={error ? true : false} errorMessage={error} handleClose={() => setError("")} />
      {/** END */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', position: 'relative', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#E4E5E7' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 16 }}>
          <AntDesign name="close" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
          Create post
        </Text>
        <TouchableHighlight style={{ position: 'absolute', right: 16, borderRadius: 6, backgroundColor: status ? '#0866FF' : 'gray', padding: 6 }}
          activeOpacity={0.6} onPress={() => status && handlePost()}>
          <Text style={{ color: status ? 'white' : '#D3D3D3', fontWeight: 'bold' }}>Post</Text>
        </TouchableHighlight>
      </View>
      <ScrollView>
        <View style={{ flexDirection: 'row', gap: 5, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Image source={user?.profilePicture ? { uri: user.profilePicture } : require('../assets/placeholder.png')} width={30} height={30} style={{ width: 30, height: 30, borderRadius: 1000 }} />
          <Text style={{ fontWeight: 'bold' }}>
            {user?.firstName} {user?.lastName}
          </Text>
        </View>
        <TextInput onChangeText={(text) => setStatus(text)} placeholder="Say something about this photo..." style={{ paddingHorizontal: 16 }} multiline />
        <Image source={{ uri: selectedPhoto?.uri }} height={400} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddPost;