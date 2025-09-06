import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/state/store";

type BookingState = {
  serviceId?: string;
  date?: string; // YYYY-MM-DD
  scheduledAt?: string; // ISO datetime
  notes?: string;
};

const initialState: BookingState = {};

const slice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setServiceId(state, action) {
      state.serviceId = action.payload;
      // reset downstream choices
      state.date = undefined;
      state.scheduledAt = undefined;
    },
    setDate(state, action) {
      state.date = action.payload;
      state.scheduledAt = undefined;
    },
    setScheduledAt(state, action) {
      state.scheduledAt = action.payload;
    },
    setNotes(state, action) {
      state.notes = action.payload;
    },
    reset(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { setServiceId, setDate, setScheduledAt, setNotes, reset } = slice.actions;
export default slice.reducer;

// Selectors
export const selectBooking = (s: RootState) => s.booking;

