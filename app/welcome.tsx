import { Link, Stack } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <Image
  source={require("../assets/brand/American_Tourister_logo.png")}
  style={styles.topImage}
/>
      <Image
        source={require("../assets/brand/brand.webp")}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to Reacts</Text>
      <Text style={styles.subtitle}>Order your luggage online and collect it from your nearest American Tourister store.</Text>

      <View style={styles.buttonContainer}>
        <Link href="/auth/sign-in" asChild>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/auth/sign-up" asChild>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: { width: 200, height: 200, resizeMode: "contain", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333" },
  subtitle: { fontSize: 16, color: "#666", marginTop: 10, marginBottom: 40 },
  buttonContainer: {
    width: "100%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  topImage: {
  width: 220,
  height: 220,
  resizeMode: "contain",
  marginBottom: -60,
},

});
