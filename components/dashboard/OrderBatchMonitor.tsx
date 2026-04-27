import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceEventEmitter } from "react-native";

const TOTAL_TIME = 2 * 60 * 1000; // 2 minutes

const OrderBatchMonitor: React.FC = () => {
  useEffect(() => {
    const tick = async () => {
      try {
        const allKeys = await AsyncStorage.getAllKeys();
        const batchesKeys = allKeys.filter((k) => k.endsWith(":eat-easy-order-batches"));

        for (const batchesKey of batchesKeys) {
          const restaurantIdPrefix = batchesKey.split(":")[0];
          const lastOrderKey = `${restaurantIdPrefix}:eat-easy-last-order`;
          
          const raw = await AsyncStorage.getItem(batchesKey);
          if (!raw) continue;

          let batches: any[];
          try {
            batches = JSON.parse(raw);
          } catch {
            continue;
          }

          let changed = false;
          const currentRestaurantName = batches[0]?.restaurantName || "Gram Bistro";

          const prepIdx = batches.findIndex((b: any) => b.status === "preparing");

          if (prepIdx !== -1) {
            const elapsed = Date.now() - batches[prepIdx].timerStart;

            if (elapsed > TOTAL_TIME) {
              // Batch finished — mark as ready
              batches[prepIdx].status = "ready";
              changed = true;

              // Notify the rest of the app (ding + toast) with restaurant info
              DeviceEventEmitter.emit("order-batch-ready", {
                restaurantName: currentRestaurantName,
              });

              // Start the next pending batch if any
              const nextPendingIdx = batches.findIndex((b: any) => b.status === "pending");
              if (nextPendingIdx !== -1) {
                batches[nextPendingIdx].status = "preparing";
                batches[nextPendingIdx].timerStart = Date.now();
              }
            }
          } else {
            // No batch currently preparing — start the next pending one
            const nextPendingIdx = batches.findIndex((b: any) => b.status === "pending");
            if (nextPendingIdx !== -1) {
              batches[nextPendingIdx].status = "preparing";
              batches[nextPendingIdx].timerStart = Date.now();
              changed = true;
            }
          }

          if (changed) {
            await AsyncStorage.setItem(batchesKey, JSON.stringify(batches));

            const allItems = batches.flatMap((b: any) => b.items);
            const totalSubtotal = batches.reduce((acc: number, b: any) => acc + b.subtotal, 0);
            const totalTax = batches.reduce((acc: number, b: any) => acc + b.tax, 0);
            const totalTotal = batches.reduce((acc: number, b: any) => acc + (b.total || 0), 0);
            const totalQty = batches.reduce((acc: number, b: any) => acc + b.qty, 0);

            await AsyncStorage.setItem(
              lastOrderKey,
              JSON.stringify({
                items: allItems,
                subtotal: totalSubtotal,
                tax: totalTax,
                total: totalTotal,
                qty: totalQty,
              })
            );
          }
        }
      } catch (e) {
        console.error("OrderBatchMonitor error:", e);
      }
    };

    const interval = setInterval(tick, 3000); // 3 seconds instead of 1 second for mobile performance
    tick(); // run immediately

    return () => clearInterval(interval);
  }, []);

  return null; // renders nothing
};

export default OrderBatchMonitor;
