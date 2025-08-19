import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
  name: 'application',
  initialState: {
    applicants: [],
  },
  reducers: {
    setAllApplicants: (state, action) => {
      state.applicants = Array.isArray(action.payload) ? action.payload : [];
    },
    updateApplicantStatus: (state, action) => {
      const { id, status } = action.payload;
      const index = state.applicants.findIndex(app => app._id === id);
      if (index !== -1) {
        state.applicants[index].status = status;
      }
    },
  },
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;
export default applicationSlice.reducer;
