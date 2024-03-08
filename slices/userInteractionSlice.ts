/* eslint-disable no-param-reassign */ // Keep this if you must bypass the rule
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

enum MenuTabTypes {
  "Dashboard" = "Dashboard",
  "LogsTable" = "LogsTable",
}

interface InteractionState {
  activeMenuTab: MenuTabTypes;
}

const initialState: InteractionState = {
  activeMenuTab: MenuTabTypes.Dashboard,
};

const interactionSlice = createSlice({
  name: "interaction",
  initialState,
  reducers: {
    setActiveMenuTab(state, action: PayloadAction<MenuTabTypes>) {
      state.activeMenuTab = action.payload;
    },
  },
});

export const { setActiveMenuTab } = interactionSlice.actions;
export default interactionSlice.reducer;
