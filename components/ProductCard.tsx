import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function ProductCard({ item }: any) {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      onPress={() => router.push(`/product/${item.id}`)}
      activeOpacity={0.9}
    >
      {item.offer && <Text style={styles.offer}>{item.offer}</Text>}

      <Image source={item.image} style={styles.image} resizeMode="cover" />

      <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
        {item.name}
      </Text>

      <View style={styles.bottomRow}>
        {/* LEFT SIDE - Size */}
        <Text style={[styles.size, { color: theme.textSecondary }]}>
          {item.size}
        </Text>

        {/* RIGHT SIDE - Price */}
        <View style={styles.priceBox}>
          <Text style={[styles.price, { color: theme.text }]}>
            ₹{item.price}
          </Text>
          <Text style={styles.mrp}>₹{item.mrp}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    margin: 8,
    elevation: 4,
  },

  offer: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E11D48",
    color: "#fff",
    fontSize: 11,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 10,
  },

  image: {
    width: "100%",
    height: 150,
    marginVertical: 8,
    borderRadius: 4,
  },

  name: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 14,
    minHeight: 36,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between", // left & right
    alignItems: "flex-end",
    marginTop: 8,
  },

  priceBox: {
    alignItems: "flex-end",
  },

  size: {
    fontSize: 11,
    color: "#777",
  },

  price: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 8,
    textAlign: "right",
  },

  mrp: {
    fontSize: 11,
    color: "#999",
    textDecorationLine: "line-through",
    textAlign: "right",
  },
});
