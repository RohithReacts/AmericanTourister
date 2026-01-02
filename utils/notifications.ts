import * as Notifications from "expo-notifications";

export async function requestPermissions() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return false;
  }
  return true;
}

export async function scheduleNotification(
  title: string,
  body: string,
  seconds: number
) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      seconds: seconds,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });
}

export async function scheduleOrderUpdates() {
  // Simulate order status updates
  await scheduleNotification(
    "✅ Order Placed",
    "Your order has been received by the restaurant.",
    1
  );
  await scheduleNotification(
    "👨‍🍳 Preparing",
    "The chef is preparing your delicious food.",
    5
  );
  await scheduleNotification(
    "🛵 Out for Delivery",
    "Your order is on the way!",
    10
  );
  await scheduleNotification(
    "🏠 Delivered",
    "Enjoy your meal! Delivered safely.",
    15
  );
}
