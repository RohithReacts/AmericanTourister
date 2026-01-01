// Force reload
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAddress } from "../context/AddressContext";
import { useTheme } from "../context/ThemeContext";

export default function AddressesScreen() {
  const { addresses, addAddress, removeAddress } = useAddress();
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState<"Home" | "Work" | "Other">("Home");

  const handleSave = () => {
    if (!name || !street || !city || !zip || !phone) {
      alert("Please fill all fields");
      return;
    }
    addAddress({ name, street, city, zip, phone, type });
    setModalVisible(false);
    // Reset
    setName("");
    setStreet("");
    setCity("");
    setZip("");
    setPhone("");
    setType("Home");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.inputBackground }]}
        >
          <Ionicons name="arrow-back" size={24} color={theme.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          My Addresses
        </Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View style={styles.cardHeader}>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <Ionicons
                  name={
                    item.type === "Home"
                      ? "home"
                      : item.type === "Work"
                      ? "briefcase"
                      : "location"
                  }
                  size={14}
                  color={theme.primary}
                />
                <Text style={[styles.typeText, { color: theme.primary }]}>
                  {item.type}
                </Text>
              </View>
              <TouchableOpacity onPress={() => removeAddress(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#E11D48" />
              </TouchableOpacity>
            </View>

            <Text style={[styles.name, { color: theme.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.address, { color: theme.textSecondary }]}>
              {item.street}, {item.city} - {item.zip}
            </Text>
            <Text style={[styles.phone, { color: theme.textSecondary }]}>
              Phone: {item.phone}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.center}>
            <Ionicons name="location-outline" size={80} color={theme.icon} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No addresses saved
            </Text>
          </View>
        }
      />

      {/* Add Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Add New Address
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                placeholder="Full Name"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={setName}
              />
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                placeholder="Street Address"
                placeholderTextColor={theme.textSecondary}
                value={street}
                onChangeText={setStreet}
              />
              <View style={styles.row}>
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      marginRight: 8,
                      color: theme.text,
                      borderColor: theme.border,
                      backgroundColor: theme.inputBackground,
                    },
                  ]}
                  placeholder="City"
                  placeholderTextColor={theme.textSecondary}
                  value={city}
                  onChangeText={setCity}
                />
                <TextInput
                  style={[
                    styles.input,
                    {
                      flex: 1,
                      color: theme.text,
                      borderColor: theme.border,
                      backgroundColor: theme.inputBackground,
                    },
                  ]}
                  placeholder="Zip Code"
                  placeholderTextColor={theme.textSecondary}
                  value={zip}
                  onChangeText={setZip}
                  keyboardType="numeric"
                />
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.border,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                placeholder="Phone Number"
                placeholderTextColor={theme.textSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />

              <View style={styles.typeRow}>
                {["Home", "Work", "Other"].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[
                      styles.typeOption,
                      { borderColor: theme.border },
                      type === t && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                    onPress={() => setType(t as any)}
                  >
                    <Text
                      style={[
                        styles.typeOptionText,
                        { color: theme.text },
                        type === t && styles.activeTypeOptionText,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setModalVisible(false)}
                >
                  <Text
                    style={[styles.cancelText, { color: theme.textSecondary }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold" },
  backBtn: { padding: 8, borderRadius: 20 },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  address: { fontSize: 14, marginBottom: 4 },
  phone: { fontSize: 14 },

  center: { alignItems: "center", marginTop: 100 },
  emptyText: { fontSize: 16, marginTop: 16 },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: { flexDirection: "row", marginBottom: 12 },
  typeRow: { flexDirection: "row", marginBottom: 20 },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  activeTypeOption: {
    // handled in inline style
  },
  typeOptionText: {},
  activeTypeOptionText: { color: "#fff", fontWeight: "bold" },

  modalActions: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: { flex: 1, padding: 14, alignItems: "center" },
  cancelText: { fontSize: 16, fontWeight: "bold" },
  saveBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
