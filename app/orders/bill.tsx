import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import * as Print from "expo-print";
import { Stack, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { supabase } from "../../lib/supabase";

export default function OrderBill() {
  const { id } = useLocalSearchParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  async function fetchOrder() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      Alert.alert("Error", "Could not fetch order details");
    } else {
      setOrder(data);
    }
    setLoading(false);
  }

  const generateHtml = () => {
    if (!order) return "";
    const total = order.total_price;
    const date = dayjs(order.created_at).format("DD MMM YYYY, h:mm A");
    const userName =
      user?.user_metadata?.full_name || user?.email || "Customer";

    const itemsHtml = order.items
      .map(
        (item: any) => `
      <tr class="item-row">
        <td>${item.name}</td>
        <td style="text-align: center;">${item.quantity}</td>
        <td style="text-align: right;">₹${item.price}</td>
        <td style="text-align: right;">₹${item.price * item.quantity}</td>
      </tr>
    `
      )
      .join("");

    const deliveryMode = order.items[0]?.delivery_mode || "delivery";
    const pickupLocation = order.items[0]?.pickup_location;

    // Delivery/Pickup Section HTML
    let deliveryInfoHtml = "";
    if (deliveryMode === "pickup") {
      deliveryInfoHtml = `
        <div class="meta-group" style="margin-top: 20px;">
          <h3>Delivery Method</h3>
          <p>PICK UP IN STORE</p>
          <p style="font-weight: normal; font-size: 12px; margin-top: 4px;">${pickupLocation}</p>
        </div>
      `;
    }

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; }
            .brand { font-size: 24px; font-weight: bold; color: #FF801F; text-transform: uppercase; letter-spacing: 2px; }
            .invoice-title { font-size: 32px; margin: 10px 0; font-weight: 300; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .meta-group h3 { font-size: 12px; text-transform: uppercase; color: #888; margin: 0 0 5px 0; }
            .meta-group p { font-size: 14px; margin: 0; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { text-align: left; padding: 12px 0; border-bottom: 2px solid #eee; font-size: 12px; text-transform: uppercase; color: #888; }
            td { padding: 16px 0; border-bottom: 1px solid #eee; font-size: 14px; }
            .total-section { text-align: right; }
            .total-row { font-size: 24px; font-weight: bold; color: #000; margin-top: 10px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #aaa; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand">American Tourister</div>
            <div class="invoice-title">INVOICE</div>
          </div>
          
          <div class="meta">
            <div class="meta-group">
              <h3>Billed To</h3>
              <p>${userName}</p>
              <p>${user?.email}</p>
            </div>
            <div class="meta-group" style="text-align: right;">
              <h3>Invoice Details</h3>
              <p>Order #${order.id.slice(0, 8)}</p>
              <p>${date}</p>
              ${deliveryInfoHtml}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item</th>
                <th style="width: 15%; text-align: center;">Qty</th>
                <th style="width: 15%; text-align: right;">Price</th>
                <th style="width: 20%; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">Total: ₹${total}</div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with American Tourister!</p>
            <p>This is a computer-generated invoice.</p>
          </div>
        </body>
      </html>
    `;
  };

  const handlePrint = async () => {
    try {
      const html = generateHtml();
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert("Error", "Failed to print invoice");
    }
  };

  const handleSharePdf = async () => {
    try {
      const html = generateHtml();
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share PDF");
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Order not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          headerTitle: "Order Invoice",
          headerTitleStyle: { color: theme.text },
          headerStyle: { backgroundColor: theme.background },
          headerTintColor: theme.primary,
        }}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.invoiceCard, { backgroundColor: theme.card }]}>
          <View style={styles.header}>
            <Text style={styles.brand}>American Tourister</Text>
            <Text style={[styles.invoiceLabel, { color: theme.textSecondary }]}>
              INVOICE
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                BILLED TO
              </Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>
                {user?.user_metadata?.full_name || "Customer"}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>
                ORDER ID
              </Text>
              <Text style={[styles.metaValue, { color: theme.text }]}>
                #{order.id.slice(0, 8)}
              </Text>

              {/* Pickup Info in Header if applicable */}
              {order.items[0]?.delivery_mode === "pickup" && (
                <View style={{ marginTop: 10, alignItems: "flex-end" }}>
                  <Text
                    style={[styles.metaLabel, { color: theme.textSecondary }]}
                  >
                    METHOD
                  </Text>
                  <View style={styles.pickupBadge}>
                    <Ionicons name="storefront" size={12} color="#fff" />
                    <Text style={styles.pickupBadgeText}>PICK UP</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.itemsSection}>
            {order.items.map((item: any, index: number) => (
              <View key={index} style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemName, { color: theme.text }]}>
                    {item.name}
                  </Text>
                  <Text
                    style={[styles.itemQty, { color: theme.textSecondary }]}
                  >
                    {item.quantity} x ₹{item.price}
                  </Text>
                </View>
                <Text style={[styles.itemTotal, { color: theme.text }]}>
                  ₹{item.price * item.quantity}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.text }]}>
              Grand Total
            </Text>
            <Text style={[styles.totalValue, { color: theme.primary }]}>
              ₹{order.total_price}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor: theme.card, borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.btn, styles.printBtn]}
          onPress={handlePrint}
        >
          <Ionicons name="print-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Print</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.shareBtn]}
          onPress={handleSharePdf}
        >
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.btnText}>Share PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 20 },
  invoiceCard: {
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: { alignItems: "center", marginBottom: 30 },
  brand: {
    fontSize: 22,
    fontWeight: "900",
    color: "#FF801F",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  invoiceLabel: {
    fontSize: 14,
    letterSpacing: 4,
    marginTop: 4,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  metaLabel: { fontSize: 10, marginBottom: 4, fontWeight: "bold" },
  metaValue: { fontSize: 16, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  itemsSection: {},
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  itemName: { fontSize: 16, fontWeight: "500", marginBottom: 2 },
  itemQty: { fontSize: 13 },
  itemTotal: { fontSize: 16, fontWeight: "600" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 18, fontWeight: "bold" },
  totalValue: { fontSize: 24, fontWeight: "900" },
  footer: {
    padding: 20,
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  printBtn: { backgroundColor: "#333" },
  shareBtn: { backgroundColor: "#FF801F" },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  pickupBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  pickupBadgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});
