import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

import { CartProvider } from "../context/CartContext";

import { AddressProvider } from "../context/AddressContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import { ThemeProvider, useTheme } from "../context/ThemeContext";

import { StatusBar } from "expo-status-bar";

function RootLayoutNav() {
  const { theme, isDark } = useTheme();

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
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="product/[id]" />
        <Stack.Screen name="favorites" options={{ headerTitle: "Favorites" }} />
        <Stack.Screen
          name="addresses"
          options={{ headerTitle: "My Addresses" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync(); // Kill native splash safely
  }, []);

  return (
    <ThemeProvider>
      <AddressProvider>
        <FavoritesProvider>
          <CartProvider>
            <RootLayoutNav />
          </CartProvider>
        </FavoritesProvider>
      </AddressProvider>
    </ThemeProvider>
  );
}
