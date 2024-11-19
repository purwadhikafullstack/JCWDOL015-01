'use client';
import { loginAdmin } from '@/lib/admin';
import { checkEmail, isVerified, loginUser, resetPassword } from '@/lib/user';
import { ILoginAdmin } from '@/types/admin';
import { ICheckEmail, ILogin, IReset } from '@/types/user';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { clearProfile, setProfile } from '@/app/store/slices/userSlice';

interface AuthContextType {
  token: string | null;
  onLogin: (data: ILogin, action: FormikHelpers<ILogin>) => void;
  onLogout: () => void;
  onLoginAdmin: (data: ILoginAdmin, action: FormikHelpers<ILoginAdmin>) => void;
  onLogoutAdmin: () => void;
  onCheckEmail: (data: ICheckEmail, action: FormikHelpers<ICheckEmail>) => void;
  onResetPassword: (data: IReset, action: FormikHelpers<IReset>) => void;
  onVerified: () => void;
  verified: boolean | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenAdmin, setTokenAdmin] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const onLogin = async (data: ILogin, action: FormikHelpers<ILogin>) => {
    try {
      const { result, ok } = await loginUser(data);
      if (result?.user?.isBlocked === true) {
        toast.error('Your account is blocked');
        router.push('/user/blocked');
        return;
      }

      if (result?.user?.isVerified === false) {
        router.push('/');
        dispatch(setProfile(result.user));
        console.log(result.user);
        return;
      }

      if (ok && result.token) {
        setToken(result.token);
        toast.success('Login successful');
        dispatch(setProfile(result.data));
        action.resetForm();
        router.back();
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error('Login failed, please try again');
    }
  };

  const onVerified = async () => {
    try {
      const { result } = await isVerified();
      if (result.data.isVerified === true) {
        return setVerified(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = async () => {
    setToken('');
    dispatch(clearProfile());
    toast.success('Logout successful');
    router.refresh();
  };

  const onLoginAdmin = async (
    data: ILoginAdmin,
    action: FormikHelpers<ILoginAdmin>,
  ) => {
    try {
      const { result, ok } = await loginAdmin(data);
      if (ok && result.data.token) {
        setTokenAdmin(result.data.token);
        toast.success('Login successful');
        action.resetForm();
        router.back();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLogoutAdmin = async () => {
    setTokenAdmin('');
    toast.success('Logout successful');
    router.refresh();
  };

  const onCheckEmail = async (
    data: ICheckEmail,
    action: FormikHelpers<ICheckEmail>,
  ) => {
    try {
      const { result, ok } = await checkEmail(data);
      if (ok) {
        toast.success(
          'An Email has been sent to you. Please check and complete the process.',
        );
        action.resetForm();
        router.push('/user/login');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };

  const onResetPassword = async (
    data: IReset,
    action: FormikHelpers<IReset>,
  ) => {
    try {
      const { result, ok } = await resetPassword(data);
      if (ok) {
        toast.success(
          'Reset password successful. Please login with your new password.',
        );
        action.resetForm();
        router.push('/user/login');
        return;
      }
      toast.error(result.message);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        token,
        onLogin,
        onVerified,
        verified,
        onLogout,
        onLoginAdmin,
        onLogoutAdmin,
        onCheckEmail,
        onResetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
