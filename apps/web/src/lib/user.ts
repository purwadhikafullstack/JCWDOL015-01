import { ICheckEmail, ILogin, IRegister, IReset } from '@/types/user';
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
      withCredentials: true,
    });
    console.log(res.data);
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};

export const checkEmail = async (data: ICheckEmail) => {
  try {
    const res = await axios.post(`${link}/user/check-email`, { data }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
}

export const resetPassword = async (data: IReset) => {
  try {
    const res = await axios.post(`${link}/user/reset-password`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return { result: res.data, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
}

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
}
