import {
  IChangeEmail,
  IChangePassword,
  IChangeProfile,
  ICheckEmail,
  ILocation,
  ILogin,
  IRegister,
  IReset,
} from '@/types/user';
import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: IRegister) => {
  try {
    const res = await axios.post(`${link}/user/`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const verifyUser = async (token: string) => {
  try {
    const res = await axios.post(
      `${link}/user/verify/${token}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log(res.data);
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const loginUser = async (data: ILogin) => {
  try {
    const res = await axios.post(`${link}/user/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const checkEmail = async (data: ICheckEmail) => {
  try {
    const res = await axios.post(
      `${link}/user/check-email`,
      {
        email: data.email, // Directly pass the email
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const resetPassword = async (data: IReset, token: string) => {
  try {
    const res = await axios.post(`${link}/user/reset-password`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const isVerified = async () => {
  try {
    const res = await axios.post(`${link}/user/is-verified`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeProfile = async (data: IChangeProfile, token: string) => {
  try {
    const res = await axios.post(`${link}/user/update-profile`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changePassword = async (data: IChangePassword, token: string) => {
  try {
    const res = await axios.post(`${link}/user/change-password`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeEmail = async (data: IChangeEmail, token: string) => {
  try {
    const res = await axios.post(`${link}/user/change-email`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const changeProfilePicture = async (
  formData: FormData,
  token: string,
) => {
  try {
  
    const res = await axios.post(`${link}/user/change-profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Ensure correct content type for file uploads
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const saveLocation = async (data: ILocation, token: string) => {
  try {
    const res = await axios.post(`${link}/user/save-location`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

