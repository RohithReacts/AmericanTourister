import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DEFAULT_LOCATIONS = [
  { type: "Home", icon: "home", address: "" },
  { type: "Work", icon: "briefcase", address: "" },
  { type: "Office", icon: "business", address: "" },
];

export default function LocationHeader() {
  const { theme, isDark } = useTheme();

  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [label, setLabel] = useState("Home");
  const [address, setAddress] = useState("Fetching location...");
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [input, setInput] = useState("");
  const [newType, setNewType] = useState<"Home" | "Work" | "Office" | "Other">(
    "Home"
  );

  useEffect(() => {
    loadSaved();
    detectLocation("Home");
  }, []);

  const loadSaved = async () => {
    const data = await AsyncStorage.getItem("USER_LOCATIONS");
    const selected = await AsyncStorage.getItem("SELECTED_LOCATION");
    if (data) setLocations(JSON.parse(data));
    if (selected) {
      const s = JSON.parse(selected);
      setLabel(s.type);
      setAddress(s.address);
    }
  };

  const saveAll = async (locs: any, selected: any) => {
    await AsyncStorage.setItem("USER_LOCATIONS", JSON.stringify(locs));
    await AsyncStorage.setItem("SELECTED_LOCATION", JSON.stringify(selected));
  };

  const detectLocation = async (type: any) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return;
    const loc = await Location.getCurrentPositionAsync({});
    const place = await Location.reverseGeocodeAsync(loc.coords);
    if (place.length) {
      const p = place[0];
      const auto = `${p.city}, ${p.region}`;
      const updated = locations.map((l) =>
        l.type === type ? { ...l, address: auto } : l
      );
      setLocations(updated);
      setLabel(type);
      setAddress(auto);
      saveAll(updated, { type, address: auto });
    }
  };

  return (
    <>
      {/* HEADER */}
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={styles.titleRow}>
            <Ionicons name="location" size={18} color={theme.primary} />
            <Text style={[styles.homeText, { color: theme.text }]}>
              {label}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            style={[styles.cityText, { color: theme.textSecondary }]}
          >
            {address}
          </Text>
        </View>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Ionicons name="chevron-down" size={24} color={theme.icon} />
        </TouchableOpacity>
      </View>

      {/* MODAL */}
      <Modal visible={open} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable onPress={() => {}}>
            <View style={[styles.sheet, { backgroundColor: theme.card }]}>
              {/* CLOSE BAR */}
              <View style={styles.sheetHeader}>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>
                  Select Location
                </Text>
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <Ionicons name="close" size={26} color={theme.text} />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity
                  style={[
                    styles.topCard,
                    { backgroundColor: theme.inputBackground },
                  ]}
                  onPress={() => detectLocation(label)}
                >
                  <Ionicons name="locate" size={22} color={theme.primary} />
                  <Text style={[styles.topText, { color: theme.text }]}>
                    Use current location
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.topCard,
                    { backgroundColor: theme.inputBackground },
                  ]}
                  onPress={() => setAdding(!adding)}
                >
                  <Ionicons name="add-circle" size={22} color={theme.primary} />
                  <Text style={[styles.topText, { color: theme.text }]}>
                    Add new address
                  </Text>
                </TouchableOpacity>

                {adding && (
                  <>
                    <TextInput
                      placeholder="Enter full address"
                      placeholderTextColor={theme.textSecondary}
                      value={input}
                      onChangeText={setInput}
                      style={[
                        styles.input,
                        {
                          color: theme.text,
                          borderColor: theme.border,
                          backgroundColor: theme.inputBackground,
                        },
                      ]}
                    />

                    <View style={styles.typeRow}>
                      {["Home", "Work", "Office", "Other"].map((t) => (
                        <TouchableOpacity
                          key={t}
                          onPress={() => setNewType(t as any)}
                          style={[
                            styles.typeBtn,
                            { borderColor: theme.border },
                            newType === t && {
                              backgroundColor: theme.primary,
                              borderColor: theme.primary,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.typeText,
                              { color: theme.textSecondary },
                              newType === t && styles.typeTextActive,
                            ]}
                          >
                            {t}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <TouchableOpacity
                      style={[
                        styles.saveBtn,
                        { backgroundColor: theme.primary },
                      ]}
                      onPress={() => {
                        if (!input) return;
                        const newLoc = {
                          type: newType,
                          icon: "location",
                          address: input,
                        };
                        const updated = [
                          ...locations.filter((l) => l.type !== newType),
                          newLoc,
                        ];
                        setLocations(updated);
                        setLabel(newType);
                        setAddress(input);
                        saveAll(updated, newLoc);
                        setOpen(false);
                        setAdding(false);
                        setInput("");
                      }}
                    >
                      <Text style={{ color: "#fff", fontWeight: "700" }}>
                        Save Address
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                <Text style={[styles.savedTitle, { color: theme.text }]}>
                  Saved Addresses
                </Text>

                {locations.map((loc) => (
                  <TouchableOpacity
                    key={loc.type}
                    style={styles.locationItem}
                    onPress={() => {
                      setLabel(loc.type);
                      setAddress(loc.address);
                      saveAll(locations, loc);
                      setOpen(false);
                    }}
                  >
                    <Ionicons
                      name={loc.icon as any}
                      size={20}
                      color={theme.primary}
                    />
                    <View style={{ marginLeft: 12 }}>
                      <Text
                        style={[styles.locationType, { color: theme.text }]}
                      >
                        {loc.type}
                      </Text>
                      <Text
                        numberOfLines={1}
                        style={{ color: theme.textSecondary }}
                      >
                        {loc.address || "Not set"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center" },
  homeText: { fontSize: 18, fontWeight: "700", marginLeft: 6 },
  cityText: { fontSize: 13, fontWeight: "600", marginTop: 4 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 20,
    maxHeight: "80%",
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800" },

  topCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#FFF3E8",
    marginBottom: 10,
  },
  topText: { marginLeft: 10, fontWeight: "700" },

  input: { borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 10 },

  typeRow: { flexDirection: "row", marginBottom: 10 },
  typeBtn: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  typeBtnActive: { backgroundColor: "#FF801F", borderColor: "#FF801F" },
  typeText: { fontWeight: "700", color: "#666" },
  typeTextActive: { color: "#fff" },

  saveBtn: {
    backgroundColor: "#FF801F",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  savedTitle: { fontSize: 14, fontWeight: "700", marginVertical: 10 },

  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  locationType: { fontWeight: "700" },
});
