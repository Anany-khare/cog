import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../api";

export const fetchSuggestedUsers = createAsyncThunk(
    'user/fetchSuggestedUsers',
    async () => {
        const response = await API.get('/api/v1/user/suggested');
        return response.data.users;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        suggestedUsers: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSuggestedUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestedUsers = action.payload;
            })
            .addCase(fetchSuggestedUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    }
});

export default userSlice.reducer; 