import {createSlice} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name:"auth",
    initialState:{
        user:null,
        suggestedUsers:[],
        userProfile:null,
        selectedUser:null,
    },
    reducers:{
        // actions
        setAuthUser:(state,action) => {
            state.user = action.payload;
        },
        setSuggestedUsers:(state,action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile:(state,action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser:(state,action) => {
            state.selectedUser = action.payload;
<<<<<<< HEAD
=======
        },
        logout:(state) => {
            state.user = null;
            state.suggestedUsers = [];
            state.userProfile = null;
            state.selectedUser = null;
>>>>>>> d997b8b (Initial commit: project ready for deployment)
        }
    }
});
export const {
    setAuthUser, 
    setSuggestedUsers, 
    setUserProfile,
    setSelectedUser,
<<<<<<< HEAD
=======
    logout,
>>>>>>> d997b8b (Initial commit: project ready for deployment)
} = authSlice.actions;
export default authSlice.reducer;