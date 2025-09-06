import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";
import * as OrderAPI from "@/state/services/orderService";
import type { Order } from "@/state/services/orderService";

type OrdersState = {
  items: Order[];
  listStatus: "idle" | "loading" | "succeeded" | "failed";
  listError?: any;
  createStatus: "idle" | "loading" | "succeeded" | "failed";
  createError?: any;
  lastCreated?: Order | null;
};

const initialState: OrdersState = {
  items: [],
  listStatus: "idle",
  createStatus: "idle",
  lastCreated: null,
};

function extractError(err: any, fallback: string) {
  const data = err?.response?.data;
  if (data && (typeof data === "object") && (data.errors || data.message)) return data;
  return fallback;
}

export const fetchOrders = createAsyncThunk("orders/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await OrderAPI.getOrders();
    return res.orders;
  } catch (err: any) {
    return rejectWithValue(extractError(err, "Failed to load orders"));
  }
});

export const createOrder = createAsyncThunk(
  "orders/create",
  async (payload: { serviceId: string; scheduledAt: string; notes?: string }, { rejectWithValue }) => {
    try {
      const res = await OrderAPI.createOrder(payload);
      return res.order;
    } catch (err: any) {
      return rejectWithValue(extractError(err, "Failed to create order"));
    }
  }
);

export const cancelOrder = createAsyncThunk("orders/cancel", async (orderId: string, { rejectWithValue }) => {
  try {
    const res = await OrderAPI.cancelOrder(orderId);
    return res.order;
  } catch (err: any) {
    return rejectWithValue(extractError(err, "Failed to cancel order"));
  }
});

const slice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCreateState(state) {
      state.createStatus = "idle";
      state.createError = null;
      state.lastCreated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.listStatus = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action: any) => {
        state.listStatus = "failed";
        state.listError = action.payload || "Failed to load orders";
      })
      .addCase(createOrder.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
        state.lastCreated = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.createStatus = "succeeded";
        state.lastCreated = action.payload;
        // Optimistically add to list
        state.items.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action: any) => {
        state.createStatus = "failed";
        state.createError = action.payload || "Failed to create order";
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        const idx = state.items.findIndex((o) => o._id === action.payload._id);
        if (idx >= 0) state.items[idx] = action.payload;
      });
  },
});

export const { clearCreateState } = slice.actions;
export default slice.reducer;

// Selectors
export const selectOrders = (s: RootState) => s.orders.items;
export const selectOrdersStatus = (s: RootState) => s.orders.listStatus;
export const selectOrderCreate = (s: RootState) => ({ status: s.orders.createStatus, error: s.orders.createError, last: s.orders.lastCreated });

