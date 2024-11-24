import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Admin {
    id: number;
    companyName: string;
    email: string;
    companyDescription: string;
    phoneNumber: string;
    companyLogo: string;
    isBlocked: boolean;
    status: string;
  
    job?:  Array<{
        id: number;
        title: string; 
        description: string;
        location: string;
        salary?: number; 
        createdAt: string; 
        expiryDate: string; 
        tags?: string; 
        remoteOption: boolean; 
      }>;
  
    notifications?: Array<{
      id: number;
      message: string;
      type: string; 
      createdAt: string; 
      status: string; 
    }>;
  }
  

interface AdminState {
    profile: null | Admin;
}

const initialState: AdminState = {
    profile: null
}

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        setAdminProfile: (state, action: PayloadAction<Admin>) => {
            state.profile = action.payload;
        },
        clearAdminProfile: (state) => {
            state.profile = null;
        }
    }
});

export const { setAdminProfile, clearAdminProfile } = adminSlice.actions;
export default adminSlice.reducer;
