import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    name?: string;
    email: string;
    password: string;
    birthDate?: string; 
    gender?: string;
    education?: string;
    address?: string;
    profilePictureUrl?: string;
    isVerified: boolean;
    isBlocked: boolean;
    subscriptionType?: string;
    subscriptionEndDate?: string; 
  
    subscriptions?: Array<{
      id: number;
      type: string; 
      startDate: string; 
      endDate: string; 
    }>;
  
    applications?: Array<{
      id: number;
      jobId: number;
      status: string; 
      resumeUrl: string; 
      appliedAt: string; 
      coverLetter?: string;
      expectedSalary?: number;
      interviewSchedule?: {
        id: number;
        dateTime: string; 
        location: string;
        status: string; 
      };
      job: {
        id: number;
        title: string; 
        description: string;
        location: string;
        salary?: number; 
        createdAt: string; 
        expiryDate: string; 
        tags?: string; 
        remoteOption: boolean; 
      };
    }>;
  
    notifications?: Array<{
      id: number;
      message: string;
      type: string; 
      createdAt: string; 
      status: string; 
    }>;
  }
  

interface UserState {
    profile: null | User;
}

const initialState: UserState = {
    profile: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile: (state, action: PayloadAction<User>) => {
            state.profile = action.payload;
        },
        clearProfile: (state) => {
            state.profile = null;
        }
    }
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
