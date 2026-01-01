import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HOME_PRODUCTS } from "../../components/data/products";
import LocationHeader from "../../components/LocationHeader";
import ProductCard from "../../components/ProductCard";
import { useTheme } from "../../context/ThemeContext";

const BANNERS = [
  require("../../assets/brand/banner.webp"),
  require("../../assets/brand/banner1.webp"),
  require("../../assets/brand/banner2.webp"),
  require("../../assets/brand/banner3.webp"),
];

export default function HomeScreen() {
  const router = useRouter();
  const { isDark, theme } = useTheme();
  const bannerRef = useRef<FlatList>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  // show only 4 items on home
  const homeProducts = HOME_PRODUCTS.slice(0, 4);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (bannerIndex + 1) % BANNERS.length;
      bannerRef.current?.scrollToIndex({ index: next, animated: true });
      setBannerIndex(next);
    }, 3500);
    return () => clearInterval(timer);
  }, [bannerIndex]);

  const Header = () => (
    <View>
      <LocationHeader />

      <View style={styles.brandHeader}>
        <Image
          source={require("../../assets/brand/American_Tourister_logo.png")}
          style={styles.brandLogo}
        />
      </View>

      <FlatList
        ref={bannerRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        keyExtractor={(_, i) => i.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image source={item} style={styles.bannerImg} />
        )}
        getItemLayout={(_, index) => ({
          length: Dimensions.get("window").width,
          offset: Dimensions.get("window").width * index,
          index,
        })}
      />

      <View style={styles.categoryGrid}>
        {[
          { icon: "briefcase", label: "Hard Luggage" },
          { icon: "cube", label: "Soft Luggage" },
          { icon: "school", label: "Back Packs" },
          { icon: "briefcase-outline", label: "Office" },
          { icon: "bag-handle", label: "Accessories" },
          { icon: "balloon", label: "Kids" },
        ].map((c, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.gridCard,
              { backgroundColor: theme.inputBackground },
            ]}
            onPress={() => router.push(`/explore?category=${c.label}`)}
          >
            <Ionicons name={c.icon as any} size={30} color="#FF801F" />
            <Text style={[styles.gridText, { color: theme.primary }]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shop Header + View All */}
      <View style={styles.shopRow}>
        <View>
          <Text style={[styles.shopTitle, { color: theme.text }]}>
            Shop Products
          </Text>
          <Text style={[styles.shopSub, { color: theme.textSecondary }]}>
            Our favorite picks for the season
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/explore")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <FlatList
        data={homeProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => <ProductCard item={item} />}
        ListHeaderComponent={Header}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 8,
        }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  brandHeader: { alignItems: "center", marginVertical: 12 },
  brandLogo: { width: 140, height: 40, resizeMode: "contain" },

  bannerImg: {
    width: Dimensions.get("window").width - 32,
    height: 160,
    borderRadius: 18,
    marginHorizontal: 16,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },

  gridCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF4EC",
    marginBottom: 10,
  },

  gridText: {
    marginTop: 6,
    fontWeight: "800",
    fontSize: 12,
    color: "#FF801F",
  },

  shopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    marginTop: -40,
    marginBottom: 10,
  },

  shopTitle: { fontSize: 18, fontWeight: "900", marginBottom: 2 },
  shopSub: { fontSize: 12, color: "#777" },

  viewAll: {
    color: "#FF801F",
    fontWeight: "800",
    fontSize: 12,
  },
});
