import { SafeAreaView, ScrollView, StatusBar, Text, View } from "react-native";
import { styles } from "../styles";
import Card from "../components/Card";
import { useQuery } from "@tanstack/react-query";
import { publicBaseURL } from "../env";
import { PostProps } from "../types";

const Home = () => {

  const getPosts = async (): Promise<PostProps[]> => {
    const res = await fetch(`${publicBaseURL}/post/limit?limit=${5}`);
    const data = await res.json();
    return data.data;
  }

  const query = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  });

  return (
    <SafeAreaView style={styles.AndroidSafeArea}>
      {/* <StatusBar backgroundColor='white' /> */}
      <View style={{ paddingHorizontal: 16, backgroundColor: 'white' }}>
        <Text style={{ fontWeight: 'bold', color: '#0866FF', fontSize: 30 }}>faceclam</Text>
      </View>
      <ScrollView style={{paddingVertical: 5}}>
        {
          query.data?.map((e) => {
            return <Card post={e} />;
          })
        }
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home;