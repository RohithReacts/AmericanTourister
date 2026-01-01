import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

type Order = {
  id: string;
  created_at: string;
  total_price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  items: any[];
  user_id: string;
};

const STATUS_COLORS = {
  pending: "#FFA500", // Orange
  confirmed: "#007AFF", // Blue
  shipped: "#9333EA", // Purple
  delivered: "#10B981", // Green
  cancelled: "#EF4444", // Red
};

export default function Orders() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Simple admin check: In a real app, check user role or metadata
  // For demo: We'll assume any user with "admin" in their email is an admin
  const isAdmin = user?.email?.toLowerCase().includes("admin");

  useEffect(() => {
    fetchOrders();
  }, [user, isAdmin]);

  async function fetchOrders() {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    // If NOT admin, filter by user_id
    if (!isAdmin) {
      query = query.eq("user_id", user.id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Could not fetch orders");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(orderId: string, newStatus: string) {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      Alert.alert("Error", "Could not update status");
    } else {
      // Optimistic update
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: newStatus as any } : o
        )
      );
    }
  }

  const renderStatusBadge = (status: string) => (
    <View
      style={[
        styles.badge,
        {
          backgroundColor:
            (STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#888") +
            "20",
        },
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          {
            color:
              STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "#888",
          },
        ]}
      >
        {status.toUpperCase()}
      </Text>
    </View>
  );

  const renderAdminControls = (order: Order) => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.adminControls}
    >
      {Object.keys(STATUS_COLORS).map((status) => (
        <TouchableOpacity
          key={status}
          style={[
            styles.statusButton,
            {
              borderColor: STATUS_COLORS[status as keyof typeof STATUS_COLORS],
              backgroundColor:
                order.status === status
                  ? STATUS_COLORS[status as keyof typeof STATUS_COLORS]
                  : "transparent",
            },
          ]}
          onPress={() => updateStatus(order.id, status)}
        >
          <Text
            style={[
              styles.statusButtonText,
              {
                color:
                  order.status === status
                    ? "#fff"
                    : STATUS_COLORS[status as keyof typeof STATUS_COLORS],
              },
            ]}
          >
            {status}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: isAdmin ? "Manage Orders" : "My Orders",
          headerShown: true,
          headerTitleStyle: { color: theme.text },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.primary,
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={80} color={theme.icon} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No orders found
          </Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: theme.card }]}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={[styles.date, { color: theme.textSecondary }]}>
                    {dayjs(item.created_at).format("MMM D, YYYY h:mm A")}
                  </Text>
                  <Text style={[styles.orderId, { color: theme.text }]}>
                    Order #{item.id.slice(0, 8)}
                  </Text>
                </View>
                {renderStatusBadge(item.status)}
              </View>

              <View style={styles.divider} />

              <View style={styles.itemsList}>
                {item.items &&
                  item.items.map((prod: any, index: number) => (
                    <Text
                      key={index}
                      style={[styles.itemText, { color: theme.textSecondary }]}
                    >
                      {prod.quantity}x {prod.name}
                    </Text>
                  ))}
              </View>

              <View style={styles.footer}>
                <Text style={[styles.totalLabel, { color: theme.text }]}>
                  Total
                </Text>
                <Text style={[styles.totalPrice, { color: theme.primary }]}>
                  ₹{item.total_price}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.billBtn,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => router.push(`/orders/bill?id=${item.id}`)}
              >
                <Ionicons name="receipt-outline" size={16} color={theme.text} />
                <Text style={[styles.billBtnText, { color: theme.text }]}>
                  View Bill
                </Text>
              </TouchableOpacity>

              {isAdmin && (
                <View style={styles.adminSection}>
                  <Text
                    style={[styles.adminLabel, { color: theme.textSecondary }]}
                  >
                    Admin: Update Status
                  </Text>
                  {renderAdminControls(item)}
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 16, fontSize: 16 },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  date: { fontSize: 12, marginBottom: 4 },
  orderId: { fontSize: 16, fontWeight: "bold" },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 8 },
  itemsList: { marginBottom: 12 },
  itemText: { fontSize: 14, marginBottom: 4 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalLabel: { fontSize: 14, fontWeight: "600" },
  totalPrice: { fontSize: 18, fontWeight: "bold" },
  billBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    gap: 6,
  },
  billBtnText: { fontSize: 14, fontWeight: "600" },

  // Admin Styles
  adminSection: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  adminLabel: { fontSize: 12, marginBottom: 8, fontWeight: "600" },
  adminControls: { flexDirection: "row" },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  statusButtonText: { fontSize: 12, fontWeight: "600" },
});
