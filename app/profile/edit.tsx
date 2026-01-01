import { Ionicons } from "@expo/vector-icons";
import { Stack, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function EditProfile() {
  const { theme, isDark } = useTheme();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || ""
  );
  const [phone, setPhone] = useState(user?.user_metadata?.phone || "");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];

  const animateIn = () => {
    setShowSuccess(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      animateOut();
    }, 2000);
  };

  const animateOut = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSuccess(false);
      router.back();
    });
  };

  async function updateProfile() {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, phone: phone },
    });

    if (error) {
      alert(error.message);
    } else {
      animateIn();
    }
    setLoading(false);
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      marginTop: 60,
    },
    formContainer: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
      color: theme.text,
      marginLeft: 4,
    },
    inputWrapper: {
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border || "#e0e0e0", // Fallback if theme.border is undefined
      overflow: "hidden",
    },
    disabledInput: {
      backgroundColor: isDark ? "#222" : "#f5f5f5",
      borderColor: "transparent",
    },
    input: {
      padding: 16,
      fontSize: 16,
      color: theme.text,
    },
    helperText: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 4,
      marginLeft: 4,
    },
    button: {
      backgroundColor: theme.primary,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 10,
      shadowColor: theme.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    successCard: {
      backgroundColor: isDark ? "#1A1A1A" : "#fff",
      padding: 30,
      borderRadius: 24,
      alignItems: "center",
      width: "80%",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    checkCircle: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "#4CAF50",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
    },
    successTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    successMessage: {
      fontSize: 14,
      color: theme.textSecondary,
      textAlign: "center",
      lineHeight: 20,
    },
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Edit Profile",
          headerTitleStyle: { color: theme.text },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.primary,
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        contentContainerStyle={styles.formContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View style={[styles.inputWrapper, styles.disabledInput]}>
            <TextInput
              style={[styles.input, { color: theme.textSecondary }]}
              value={user?.email}
              editable={false}
            />
          </View>
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: isDark ? "#333" : "#fff" },
            ]}
          >
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Ex: Rohith Kumar"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <View
            style={[
              styles.inputWrapper,
              { backgroundColor: isDark ? "#333" : "#fff" },
            ]}
          >
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Ex: +91 9876543210"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={updateProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <Modal transparent visible={showSuccess} animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.successCard,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Profile Updated!</Text>
            <Text style={styles.successMessage}>
              Your changes have been saved successfully.
            </Text>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}
