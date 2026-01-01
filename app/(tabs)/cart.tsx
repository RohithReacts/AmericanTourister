import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function Cart() {
  const { items, removeFromCart, updateQuantity, clearCart, total } = useCart();
  const { theme, isDark } = useTheme();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">(
    "pickup"
  );

  const STORE_ADDRESS =
    "Vaishnavi Sales 6-7-66, Raganna Darwaza, Main Road, Hyderabad - Warangal Hwy, Brahmanawada, Hanamkonda, Telangana 506011. Ph: 8374200125";

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleCheckout = async () => {
    if (loading) return;
    if (!user) {
      router.push("/auth/sign-in");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.from("orders").insert([
        {
          user_id: user.id,
          items: items.map((i) => ({
            ...i,
            delivery_mode: deliveryMode,
            pickup_location:
              deliveryMode === "pickup" ? STORE_ADDRESS : undefined,
          })),
          total_price: total,
          status: "pending",
        },
      ]);

      if (error) throw error;

      clearCart();
      router.push("/orders");
    } catch (error: any) {
      console.error("Checkout Error:", error);
      alert("Checkout failed: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Ionicons name="basket" size={100} color={theme.icon} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          Your cart is empty
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <Text style={[styles.title, { color: theme.text }]}>My Cart</Text>

      <FlatList
        data={items}
        contentContainerStyle={{ paddingBottom: 100 }}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={[styles.cartItem, { backgroundColor: theme.card }]}>
            <Image source={item.image} style={styles.image} />

            <View style={styles.info}>
              <Text
                style={[styles.name, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text style={[styles.price, { color: theme.textSecondary }]}>
                ₹{item.price}
              </Text>

              <View style={styles.controls}>
                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color={theme.primary}
                  />
                </TouchableOpacity>

                <Text style={[styles.qty, { color: theme.text }]}>
                  {item.quantity}
                </Text>

                <TouchableOpacity
                  onPress={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={theme.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.delete}
            >
              <Ionicons name="trash-outline" size={20} color="#E11D48" />
            </TouchableOpacity>
          </View>
        )}
      />

      <View
        style={[
          styles.footer,
          { backgroundColor: theme.card, borderTopColor: theme.border },
        ]}
      >
        <View
          style={[
            styles.pickupInfo,
            { backgroundColor: theme.inputBackground },
          ]}
        >
          <Text style={[styles.pickupLabel, { color: theme.textSecondary }]}>
            Pickup Location:
          </Text>
          <Text style={[styles.pickupAddress, { color: theme.text }]}>
            {STORE_ADDRESS}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total:</Text>
          <Text style={[styles.totalPrice, { color: theme.text }]}>
            ₹{total}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, loading && { opacity: 0.7 }]}
          onPress={handleCheckout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>Checkout</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { marginTop: 16, fontSize: 18, color: "#888" },

  title: { fontSize: 24, fontWeight: "bold", marginVertical: 16 },

  cartItem: {
    flexDirection: "row",
    backgroundColor: "#F9F9F9",
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  image: { width: 70, height: 70, borderRadius: 10, resizeMode: "contain" },

  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: "bold", color: "#333" },
  price: { fontSize: 14, color: "#666", marginTop: 4 },

  controls: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  qty: { marginHorizontal: 12, fontWeight: "bold", fontSize: 16 },

  delete: { padding: 8 },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  totalLabel: { fontSize: 18, color: "#444" },
  totalPrice: { fontSize: 22, fontWeight: "bold", color: "#000" },

  checkoutBtn: {
    backgroundColor: "#FF801F",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // Toggle
  toggleContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  toggleText: { fontWeight: "600", fontSize: 14 },

  pickupInfo: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  pickupLabel: { fontSize: 12, marginBottom: 4 },
  pickupAddress: { fontSize: 13, fontWeight: "600" },
});
