import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  password?: string;
  email: string;
  name?: string;
  birthDate?: string;
  gender?: string;
  education?: string;
  address?: string;
  currentLocation?: string;
  latitude?: number;
  longitude?: number;
  profilePicture?: string;
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
    resume: string;
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
  savedJobs?: Array<{
    userId: number;
    jobId: number;
    savedAt: string;
  }>;
  notifications?: Array<{
    id: number;
    message: string;
    type: string;
    createdAt: string;
    status: string;
  }>;
  paymentHistories?: Array<{
    id: number;
    amount: number;
    paymentMethod: string;
    paymentDate: string;
    transactionId: string;
    status: string;
  }>;
  auth?: {
    id: number;
    email: string;
    password: string;
    lastLogin?: string;
    loginAttempts: number;
  };
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
