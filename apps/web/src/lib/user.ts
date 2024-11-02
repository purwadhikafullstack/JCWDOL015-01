import { ILogin, IRegister } from '@/types/user';
import axios from 'axios';

const link = process.env.NEXT_PUBLIC_API_URL;

export const registerUser = async (data: IRegister) => {
  try {
    const res = await axios.post(`${link}user/`, data, {
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
      `${link}user/verify/${token}`,
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
    const res = await axios.post(`${link}user/login`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return { result: res, ok: true };
  } catch (error) {
    const err = error as any;
    return { result: err.response?.data || 'Connection error', ok: false };
  }
};
