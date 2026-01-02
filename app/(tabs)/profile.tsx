import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadNotificationPreference();
  }, []);

  const loadNotificationPreference = async () => {
    try {
      const value = await AsyncStorage.getItem("order_notifications");
      if (value !== null) {
        setNotificationsEnabled(value === "true");
      }
    } catch (e) {
      console.error("Failed to load notification preference");
    }
  };

  const toggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    try {
      await AsyncStorage.setItem("order_notifications", String(value));
    } catch (e) {
      console.error("Failed to save notification preference");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might re-fetch user data here if needed,
    // but auth state is usually reactive.
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
  );

  const MenuItem = ({
    icon,
    label,
    desc,
    isLast,
    onPress,
  }: {
    icon: any;
    label: string;
    desc?: string;
    isLast?: boolean;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.menuItem,
        isLast && { borderBottomWidth: 0 },
        { borderBottomColor: theme.border },
      ]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View
        style={[styles.iconBox, { backgroundColor: theme.inputBackground }]}
      >
        <Ionicons name={icon} size={20} color={theme.icon} />
      </View>
      <View style={styles.menuContent}>
        <Text style={[styles.menuLabel, { color: theme.text }]}>{label}</Text>
        {desc && (
          <Text style={[styles.menuDesc, { color: theme.textSecondary }]}>
            {desc}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.icon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <View>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user?.user_metadata?.full_name || "New User"}
            </Text>
            <View style={styles.row}>
              <Text style={styles.userPhone}>
                {user?.user_metadata?.phone || "No phone added"}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/profile/edit")}>
              <Text style={styles.editProfile}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
          {/* Avatar or Initials could go here if needed */}
        </View>

        <View style={[styles.divider, { backgroundColor: theme.background }]} />

        {/* SECTION 1: MY ACCOUNT */}
        <View style={styles.section}>
          <SectionTitle title="MY ACCOUNT" />
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <MenuItem
              icon="bag-check-outline"
              label="Orders"
              desc="See your past orders and status"
              onPress={() => router.push("/orders")}
            />
            <MenuItem
              icon="heart-outline"
              label="Favorites"
              desc="Products you've saved for later"
              onPress={() => router.push("/favorites")}
            />
            <MenuItem
              icon="location-outline"
              label="Address"
              desc="Manage your delivery addresses"
              onPress={() => router.push("/addresses")}
              isLast
            />
          </View>
        </View>

        {/* SECTION 2: SETTINGS */}
        <View style={styles.section}>
          <SectionTitle title="SETTINGS" />
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View
              style={[styles.menuItem, { borderBottomColor: theme.border }]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.inputBackground },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={theme.icon}
                />
              </View>
              <View style={[styles.menuContent, { marginRight: 10 }]}>
                <Text style={[styles.menuLabel, { color: theme.text }]}>
                  Order Updates
                </Text>
                <Text style={[styles.menuDesc, { color: theme.textSecondary }]}>
                  Get notified when order status changes
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: "#767577", true: theme.primary }}
                thumbColor={"#f4f3f4"}
              />
            </View>

            <MenuItem
              icon="trash-outline"
              label="Delete Account"
              desc="Permanently delete your account"
              isLast
              onPress={handleDeleteAccount}
            />
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { backgroundColor: theme.card, borderColor: theme.primary },
          ]}
          onPress={handleSignOut}
        >
          <Text style={styles.logoutText}>LOG OUT</Text>
        </TouchableOpacity>

        <Text style={styles.version}>RohithReacts.dev</Text>
      </ScrollView>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <View style={styles.warningIconBox}>
              <Ionicons name="warning" size={32} color="#EF4444" />
            </View>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Delete Account?
            </Text>
            <Text style={styles.modalDesc}>
              Are you sure you want to delete your account? This action cannot
              be undone and you will lose all data.
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: theme.inputBackground },
                ]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={[styles.modalBtnText, { color: theme.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: "#EF4444" }]}
                onPress={async () => {
                  setShowDeleteModal(false);
                  // Adding a small delay for better UX before signout
                  setTimeout(async () => {
                    await handleSignOut();
                  }, 300);
                }}
              >
                <Text style={[styles.modalBtnText, { color: "#fff" }]}>
                  Yes, Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F2F6", // Light grey background like Swiggy
  },
  divider: {
    height: 12,
    backgroundColor: "#F1F2F6",
  },

  // Header
  header: {
    padding: 20,
    backgroundColor: "#fff",
    paddingBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#333",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  userPhone: {
    fontSize: 14,
    color: "#666",
  },
  dot: {
    marginHorizontal: 6,
    color: "#ccc",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  editProfile: {
    marginTop: 12,
    color: "#FF801F",
    fontWeight: "700",
    fontSize: 14,
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#888",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    paddingVertical: 4,
  },

  // Menu Item
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F6F8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuContent: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  menuDesc: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },

  // Footer
  logoutBtn: {
    marginTop: 30,
    marginHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FF801F",
    alignItems: "center",
  },
  logoutText: {
    color: "#FF801F",
    fontWeight: "800",
    fontSize: 14,
  },
  version: {
    textAlign: "center",
    color: "#ccc",
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  warningIconBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2", // Light red
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalDesc: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
});
