import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { supabase } from "../lib/supabase";

export function OrderNotificationListener() {
  const { user } = useAuth();
  const { showToast } = useToast();
  // Keep track of the last processed status to avoid duplicate notifications if any
  const lastStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Listen to changes on the 'orders' table
    const subscription = supabase
      .channel("orders-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${user.id}`, // Only listen to this user's orders
        },
        async (payload) => {
          console.log("Order update received:", payload);
          const newOrder = payload.new as any;

          const enabled = await AsyncStorage.getItem("order_notifications");
          if (enabled === "false") return;

          handleStatusChange(newOrder.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [user]);

  const handleStatusChange = async (status: string) => {
    let title = "Order Update";
    let body = `Your order is now ${status}`;

    switch (status) {
      case "confirmed":
        title = "✅ Order Confirmed";
        body = "The restaurant has accepted your order.";
        break;
      case "delivered":
        title = "🏠 Delivered";
        body = "Enjoy your meal! Delivered safely.";
        break;
      case "cancelled":
        title = "❌ Order Cancelled";
        body = "Your order was cancelled. Please check the app for details.";
        break;
      default:
        // Ignore waiting/pending if we don't want to spam
        if (status === "pending") return;
        break;
    }

    // Show in-app toast
    showToast(title, body);
  };

  return null; // Headless component
}
