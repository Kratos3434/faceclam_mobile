import { ActivityIndicator, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../styles";
import { useRef, useState } from "react";
import { FontAwesome } from '@expo/vector-icons';
import { useAtom } from "jotai";
import { currentUserAtom, loginAtom } from "../store";
import * as SecureStore from 'expo-secure-store';
import MyModal from "../components/MyModal";
import { publicBaseURL } from "../env";
import { userBaseURL } from "../env";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, isLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [eye, setEye] = useState<any>("eye-slash");
  const [loggedIn, isLoggedIn] = useAtom(loginAtom);
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);

  // const emailRef = useRef(null);
  const passwordRef: any = useRef(null);

  const getCurrentUser = async (token: string) => {
    const res = await fetch(`${userBaseURL}/current`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();
    return data.data;
  }

  const handleLogin = async () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    setError("");
    isLoading(true);
    try {
      const res = await fetch(`${publicBaseURL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      const cookieToken = res.headers.get('set-cookie');
      const token = cookieToken?.substring(cookieToken.indexOf('=') + 1, cookieToken.indexOf(';'));
      if (data.status) {
        if (token) {
          await SecureStore.setItemAsync('token', token);
          setCurrentUser(await getCurrentUser(token));
          isLoggedIn(true);
        } else {
          setError(data.error);
          isLoading(false);
        }
      } else {
        setError(data.error);
        isLoading(false);
      }
    } catch (err) {
      setError("Something went wrong :(");
      isLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.LoginSafeArea}>
        {
          loading &&
          <MyModal>
            <ActivityIndicator size={70} />
            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15, marginVertical: 15 }}>Logging in, please wait...</Text>
          </MyModal>
        }
        <Text style={{ fontWeight: 'bold', color: '#0866FF', fontSize: 70 }}>faceclam</Text>
        <View style={{ paddingHorizontal: 16, width: '100%', gap: 10 }}>
          <TextInput placeholder="Email" style={{ borderRadius: 6, padding: 8, borderWidth: 1, borderColor: 'gray' }} returnKeyType="next" onSubmitEditing={() => {
            if (passwordRef.current) {
              passwordRef.current.focus();
            }
          }} keyboardType="email-address" onChangeText={(text) => setEmail(text)} />
          <View style={{ borderRadius: 6, padding: 8, borderWidth: 1, borderColor: 'gray', flexDirection: 'row' }}>
            <TextInput placeholder="Password" ref={passwordRef} secureTextEntry={!showPass}
              onChangeText={(text) => setPassword(text)} style={{ flex: 1 }} />
            <TouchableOpacity onPress={() => {
              if (eye == "eye") {
                setEye("eye-slash");
                setShowPass(false);
              } else {
                setEye("eye");
                setShowPass(true);
              }
            }}>
              <FontAwesome name={eye} size={24} color="black" />
            </TouchableOpacity>
          </View>
          {error && <Text style={{ textAlign: 'center', fontSize: 13, color: 'red' }}>*{error}</Text>}
          <TouchableOpacity style={{ borderRadius: 1000, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0866FF', paddingVertical: 10 }} onPress={handleLogin}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Login;