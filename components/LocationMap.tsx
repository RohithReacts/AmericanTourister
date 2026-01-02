import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LocationMapProps {
  onConfirm: (location: {
    address: string;
    latitude: number;
    longitude: number;
  }) => void;
  onCancel: () => void;
}

export default function LocationMap({ onConfirm, onCancel }: LocationMapProps) {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const [region, setRegion] = useState<Region | undefined>(undefined);
  const [address, setAddress] = useState("Fetching address...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setAddress("Permission denied");
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const initialRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005, // Zoomed in a bit more
        longitudeDelta: 0.005,
      };
      setRegion(initialRegion);
      // Ensure we fetch address for initial location
      fetchAddress(initialRegion.latitude, initialRegion.longitude);
      setLoading(false);
    })();
  }, []);

  const fetchAddress = async (lat: number, lng: number) => {
    try {
      setAddress("Updating...");
      const place = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lng,
      });

      if (place.length > 0) {
        const p = place[0];
        const formatted = [p.street, p.subregion, p.city, p.region]
          .filter(Boolean)
          .join(", ");
        setAddress(formatted);
      }
    } catch (e) {
      setAddress("Could not fetch address");
    }
  };

  const onRegionChangeComplete = (reg: Region) => {
    // Only update ref/internal state, don't force re-render of map by changing region prop if using initialRegion
    // But we do need to track it for "Confirm"
    setRegion(reg);
    fetchAddress(reg.latitude, reg.longitude);
  };

  const handleRecenter = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;

    const loc = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    mapRef.current?.animateToRegion(newRegion, 1000);
    // Address will update via onRegionChangeComplete when animation finishes
  };

  if (loading || !region) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 10, color: theme.text }}>
          Locating you...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        style={isDark ? "light" : "dark"}
        backgroundColor="transparent"
        translucent
      />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={true} // Enabled as requested
        showsMyLocationButton={false}
      />

      {/* Top Left Back Button - Safe Area Aware */}
      <TouchableOpacity
        style={[
          styles.backBtn,
          {
            backgroundColor: theme.card,
            top: insets.top + 10, // Dynamic top padding
          },
        ]}
        onPress={onCancel}
      >
        <Ionicons name="arrow-back" size={24} color={theme.text} />
      </TouchableOpacity>

      {/* Fixed Marker in Center */}
      <View style={styles.markerFixed}>
        <View style={styles.markerShadow} />
        <Ionicons name="location-sharp" size={44} color="#E11D48" />
      </View>

      {/* Bottom Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card, paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Re-center Button (Anchored to Card) */}
        <TouchableOpacity
          style={[styles.recenterBtn, { backgroundColor: theme.card }]}
          onPress={handleRecenter}
        >
          <Ionicons name="locate" size={24} color={theme.primary} />
        </TouchableOpacity>

        <View style={styles.dragBar} />

        <Text style={[styles.cardHeader, { color: theme.textSecondary }]}>
          SELECT DELIVERY LOCATION
        </Text>

        <View style={styles.addressContainer}>
          <Ionicons
            name="location"
            size={28}
            color={theme.primary}
            style={{ marginTop: 2 }}
          />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={[styles.title, { color: theme.text }]}>
              {address.split(",")[0] || "Unknown Location"}
            </Text>
            <Text
              numberOfLines={2}
              style={[styles.address, { color: theme.textSecondary }]}
            >
              {address}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
          onPress={() =>
            onConfirm({
              address,
              latitude: region.latitude,
              longitude: region.longitude,
            })
          }
        >
          <Text style={styles.confirmText}>Confirm Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

  backBtn: {
    position: "absolute",
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 20,
  },

  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -22,
    marginTop: -44,
    zIndex: 10,
    alignItems: "center",
  },
  markerShadow: {
    position: "absolute",
    bottom: 2,
    width: 12,
    height: 6,
    borderRadius: 6,
    backgroundColor: "rgba(0,0,0,0.2)",
  },

  recenterBtn: {
    position: "absolute",
    top: -70, // Floats above the card
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    zIndex: 25,
  },

  card: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dragBar: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  cardHeader: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  addressContainer: {
    flexDirection: "row",
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 6,
  },
  address: {
    fontSize: 15,
    lineHeight: 22,
  },

  confirmBtn: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
  },
});
