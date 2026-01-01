import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

import { CartProvider } from "../context/CartContext";

import { AddressProvider } from "../context/AddressContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

import { StatusBar } from "expo-status-bar";

function RootLayoutNav() {
  const { theme, isDark } = useTheme();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)";
    const inWelcome = segments[0] === "welcome";

    if (!session && !inAuthGroup && !inWelcome) {
      router.replace("/welcome");
    } else if (session && (inAuthGroup || inWelcome)) {
      router.replace("/(tabs)");
    }
  }, [session, loading, segments]);

  if (loading) return null;

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="auth/sign-in" />
        <Stack.Screen name="auth/sign-up" />
        <Stack.Screen name="auth/forgot-password" />
        <Stack.Screen name="auth/reset-password" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="profile/edit"
          options={{ headerTitle: "Edit Profile" }}
        />
        <Stack.Screen
          name="orders/index"
          options={{ headerTitle: "My Orders" }}
        />
        <Stack.Screen
          name="orders/bill"
          options={{ headerTitle: "Tax Invoice" }}
        />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen
          name="favorites"
          options={{ headerTitle: "Favorites", headerShown: true }}
        />
        <Stack.Screen
          name="addresses"
          options={{ headerTitle: "My Address", headerShown: false }}
        />
      </Stack>
    </>
  );
}

import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync(); // Kill native splash safely
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <AddressProvider>
            <FavoritesProvider>
              <CartProvider>
                <RootLayoutNav />
              </CartProvider>
            </FavoritesProvider>
          </AddressProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
