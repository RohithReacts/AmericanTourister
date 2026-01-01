import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function ForgotPassword() {
  const { theme, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendResetEmail() {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "exp://192.168.1.10:8081/auth/reset-password", // Note: This needs to be configured with your actual deep link scheme
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Check your email!", "Password reset link has been sent.");
      router.back();
    }
    setLoading(false);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: theme.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 30,
      color: theme.text,
      textAlign: "center",
    },
    input: {
      backgroundColor: isDark ? "#333" : "#f0f0f0",
      padding: 15,
      borderRadius: 10,
      marginBottom: 15,
      color: theme.text,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      alignItems: "center",
      marginBottom: 15,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    description: {
      color: theme.text,
      marginBottom: 20,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerTransparent: true, headerTitle: "" }} />
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={sendResetEmail}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Send Reset Link</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
