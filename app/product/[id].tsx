import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HOME_PRODUCTS as PRODUCTS } from "../../components/data/products";
import { useCart } from "../../context/CartContext";
import { useFavorites } from "../../context/FavoritesContext";
import { useTheme } from "../../context/ThemeContext";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const product = PRODUCTS.find((p) => p.id.toString() === id);

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Product not found</Text>
      </View>
    );
  }

  const isFav = isFavorite(product.id);

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backBtn, { backgroundColor: theme.inputBackground }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.icon} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            Details
          </Text>
          <TouchableOpacity onPress={toggleFavorite}>
            <Ionicons
              name={isFav ? "heart" : "heart-outline"}
              size={24}
              color={isFav ? "#E11D48" : theme.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={product.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={[styles.name, { color: theme.text }]}>
            {product.name}
          </Text>
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: theme.text }]}>
              ₹{product.price}
            </Text>
            <Text style={styles.mrp}>MRP ₹{product.mrp}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.offer}</Text>
            </View>
          </View>
          <Text style={styles.taxText}>Inclusive of all taxes</Text>

          <View
            style={[
              styles.warrantyBox,
              {
                backgroundColor: isDark ? "#14532D" : "#F0FDF4",
                borderColor: isDark ? "#166534" : "#DCFCE7",
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={20} color="#22C55E" />
            <Text
              style={[
                styles.warrantyText,
                { color: isDark ? "#BBF7D0" : "#15803D" },
              ]}
            >
              3 Years Global Warranty
            </Text>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Product Description
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            {product.description ||
              "No description available for this product."}
          </Text>

          {/* Sizes or other attributes could go here */}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View
        style={[
          styles.bottomBar,
          { backgroundColor: theme.card, borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => {
            addToCart(product);
            router.push("/cart");
          }}
        >
          <Text style={styles.cartBtnText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  backBtn: {
    padding: 8,
    borderRadius: 50,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },

  imageContainer: {
    width: "100%",
    height: 400,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: 10, // 🔥 IMPORTANT
  },

  infoContainer: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    justifyContent: "space-between",
  },
  price: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#000",
    marginRight: 10,
  },
  mrp: {
    fontSize: 16,
    color: "#888",
    textDecorationLine: "line-through",
    marginRight: 10,
    textAlign: "right",
  },
  badge: {
    backgroundColor: "#E11D48",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  taxText: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "600",
    marginBottom: 16,
  },
  warrantyBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  warrantyText: {
    marginLeft: 8,
    color: "#15803D",
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
  },

  bottomBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  cartBtn: {
    backgroundColor: "#FF801F",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cartBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
