import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
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
import ProductCard from "../../components/ProductCard";
import { useTheme } from "../../context/ThemeContext";

const CATEGORIES = [
  "All",
  "Hard Luggage",
  "Soft Luggage",
  "Back Packs",
  "Office",
  "Accessories",
  "Kids",
];

export default function Explore() {
  const { category } = useLocalSearchParams();
  const { theme, isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (category) {
      setActiveCategory(category as string);
    }
  }, [category]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const filteredProducts =
    activeCategory === "All"
      ? PRODUCTS
      : PRODUCTS.filter((item) => item.category === activeCategory);

  const Header = () => (
    <View>
      <Text style={[styles.headerTitle, { color: theme.text }]}>
        Shop by Category
      </Text>

      <View style={styles.card}>
        <Image
          source={require("../../assets/brand/banner4.webp")}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.title}>Welcome To The World Of</Text>
          <Text style={styles.subtitle}>American Tourister</Text>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.tab,
                { backgroundColor: theme.inputBackground },
                activeCategory === cat && styles.activeTab,
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.textSecondary },
                  activeCategory === cat && styles.activeTabText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top"]}
    >
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={Header}
        contentContainerStyle={{
          paddingBottom: 100,
          paddingHorizontal: 8,
        }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => <ProductCard item={item} />}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              No items found in this category.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 12,
  },

  tabsContainer: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    marginRight: 10,
    height: 36,
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "#FF801F",
  },
  tabText: {
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: "#fff",
  },

  center: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
  },
  card: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden", // IMPORTANT
    marginHorizontal: 16,
    marginTop: 20,
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)", // dark layer for readability
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },

  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },

  subtitle: {
    color: "#eee",
    fontSize: 18,
    fontWeight: "500",
    marginTop: 6,
  },
});
