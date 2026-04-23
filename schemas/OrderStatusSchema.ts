import { useEffect, useState } from "react";
import { getRestaurantStorageKey } from "../contexts/RestaurantContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ContentStatus = {
  text: string;
  time?: string;
  statusKey: string; // used to pick image/icon in RN instead of web img path
  action?: string;
};

export const OrderStatusSchema = (restaurantId: string | null = null) => {
  const TOTAL_TIME = 2 * 60 * 1000;
  const MID_TIME = 1 * 60 * 1000;

  const batchesKey = getRestaurantStorageKey(restaurantId, "eat-easy-order-batches");
  const lastOrderKey = getRestaurantStorageKey(restaurantId, "eat-easy-last-order");

  const status: Record<string, ContentStatus> = {
    start: {
      text: "Your order will be ready in",
      time: "2 minutes",
      action: "Your order is being made. Would you like to order anything else?",
      statusKey: "start",
    },
    mid: {
      text: "Your order is",
      time: "almost ready",
      action: "Your order is being made. Would you like to order anything else?",
      statusKey: "mid",
    },
    end: {
      text: "Your order is ready,",
      time: "enjoy",
      action: "Enjoy your meal. Would you like to order anything else?",
      statusKey: "end",
    },
  };

  const [batches, setBatches] = useState<any[]>([]);
  const [currentStatus, setCurrentStatus] = useState<ContentStatus>(status.start);
  const [showRecommend, setShowRecommend] = useState(true);
  const [showSubmit, setShowSubmit] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const readState = async () => {
      try {
        const raw = await AsyncStorage.getItem(batchesKey);
        if (!raw) {
          setBatches([]);
          return;
        }

        let currentBatches: any[];
        try {
          currentBatches = JSON.parse(raw);
        } catch {
          setBatches([]);
          return;
        }

        const prepIdx = currentBatches.findIndex((b: any) => b.status === "preparing");

        if (prepIdx !== -1) {
          const activeBatch = currentBatches[prepIdx];

          const safeTimerStart =
            typeof activeBatch.timerStart === "number" && Number.isFinite(activeBatch.timerStart)
              ? activeBatch.timerStart
              : Date.now();

          if (safeTimerStart !== activeBatch.timerStart) {
            activeBatch.timerStart = safeTimerStart;
            await AsyncStorage.setItem(batchesKey, JSON.stringify(currentBatches));
          }

          const elapsed = Date.now() - safeTimerStart;
          const remaining = Math.max(0, Math.floor((TOTAL_TIME - elapsed) / 1000));

          setTimeLeft(remaining);

          if (elapsed <= MID_TIME) {
            setCurrentStatus(status.start);
            setShowRecommend(true);
            setShowSubmit(false);
          } else if (elapsed <= TOTAL_TIME) {
            setCurrentStatus(status.mid);
            setShowRecommend(true);
            setShowSubmit(false);
          }
        } else {
          const anyPending = currentBatches.some((b: any) => b.status === "pending");
          const anyReady = currentBatches.some((b: any) => b.status === "ready");

          if (!anyPending && anyReady) {
            setCurrentStatus(status.end);
            setShowSubmit(false);
            setShowRecommend(true);
            setTimeLeft(0);
          }
        }

        setBatches(currentBatches);
      } catch (e) {
        console.error("Error reading order status:", e);
      }
    };

    const interval = setInterval(readState, 1000);
    readState();

    return () => clearInterval(interval);
  }, [batchesKey, lastOrderKey]);

  return { currentStatus, showRecommend, showSubmit, timeLeft, batches };
};
