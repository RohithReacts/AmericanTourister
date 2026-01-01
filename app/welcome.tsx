import { View, Text, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.replace("/(tabs)");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/brand/brand.webp")} style={styles.logo} />
      <Text style={styles.title}>Welcome to Reacts</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: { width: 280, height: 280, resizeMode: "contain" },
  title: { marginTop: 15, fontSize: 22, fontWeight: "600" },
});
