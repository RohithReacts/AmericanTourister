import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function Profile() {
  const router = useRouter();
  const { isDark, toggleTheme, theme } = useTheme();
  const { user, signOut } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // In a real app, you might re-fetch user data here if needed,
    // but auth state is usually reactive.
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Router redirection is handled in _layout.tsx
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
            />
            <MenuItem
              icon="heart-outline"
              label="Favorites"
              desc="Products you've saved for later"
              onPress={() => router.push("/favorites")}
            />
            <MenuItem
              icon="location-outline"
              label="Addresses"
              desc="Manage your delivery addresses"
              onPress={() => router.push("/addresses")}
              isLast
            />
          </View>
        </View>

        {/* SECTION 2: PAYMENTS */}
        <View style={styles.section}>
          <SectionTitle title="PAYMENTS & REFUNDS" />
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <MenuItem
              icon="card-outline"
              label="Payment Methods"
              desc="Manage cards and UPI"
            />
            <MenuItem
              icon="wallet-outline"
              label="Refund Status"
              desc="Check status of your refunds"
              isLast
            />
          </View>
        </View>

        {/* SECTION 3: MORE */}
        <View style={styles.section}>
          <SectionTitle title="MORE" />
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <View
              style={[
                styles.menuItem,
                { borderBottomColor: theme.border, borderBottomWidth: 1 },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: isDark ? "#333" : "#F5F6F8" },
                ]}
              >
                <Ionicons
                  name="moon-outline"
                  size={20}
                  color={isDark ? "#fff" : "#555"}
                />
              </View>
              <View
                style={[
                  styles.menuContent,
                  {
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={[styles.menuLabel, { color: theme.text }]}>
                  Dark Mode
                </Text>
                <Switch
                  value={isDark}
                  onValueChange={toggleTheme}
                  trackColor={{ false: "#eee", true: "#FF801F" }}
                  thumbColor={"#fff"}
                />
              </View>
            </View>

            <MenuItem icon="help-circle-outline" label="Help & Support" />
            <MenuItem icon="settings-outline" label="Settings" isLast />
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
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>

        <Text style={styles.version}>App Version 1.0.0</Text>
      </ScrollView>
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
});
