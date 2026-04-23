import { useOrderContext } from "../contexts/OrderContext";

export function useOrder() {
  return useOrderContext();
}
