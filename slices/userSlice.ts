/* eslint-disable no-param-reassign */ // Keep this if you must bypass the rule
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  id: string;
  imageUrl: string;
  firstName: string;
  lastName: string;
  stripeCustomerId: string;
  paymentMethod: string;
  billingAddress: string;
  subscriptionPlan: string;
  subscriptionIsActive: boolean;
  subscriptionMetadata?: Record<string, unknown>;
}

const initialState: UserState = {
  email: "",
  id: "",
  imageUrl: "",
  firstName: "",
  lastName: "",
  stripeCustomerId: "",
  paymentMethod: "",
  billingAddress: "",
  subscriptionPlan: "",
  subscriptionIsActive: false,
  subscriptionMetadata: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.imageUrl = action.payload.imageUrl;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.stripeCustomerId = action.payload.stripeCustomerId;
      state.paymentMethod = action.payload.paymentMethod;
      state.billingAddress = action.payload.billingAddress;
      state.subscriptionPlan = action.payload.subscriptionPlan;
      state.subscriptionIsActive = action.payload.subscriptionIsActive;
      state.subscriptionMetadata = action.payload.subscriptionMetadata;
    },
    setSubscriptionPlan: (state, action: PayloadAction<string>) => {
      state.subscriptionPlan = action.payload;
    },
    setSubscriptionIsActive: (state, action: PayloadAction<boolean>) => {
      state.subscriptionIsActive = action.payload;
    },
  },
});

export const { setUser, setSubscriptionIsActive, setSubscriptionPlan } =
  userSlice.actions;
export default userSlice.reducer;
