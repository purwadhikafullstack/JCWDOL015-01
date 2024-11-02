'use client';
import { loginAdmin } from '@/lib/admin';
import { loginUser } from '@/lib/user';
import { ILoginAdmin } from '@/types/admin';
import { ILogin } from '@/types/user';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
  token: string | null;
  onLogin: (data: ILogin, action: FormikHelpers<ILogin>) => void;
  onLogout: () => void;
  onLoginAdmin: (data: ILoginAdmin, action: FormikHelpers<ILoginAdmin>) => void;
  onLogoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenAdmin, setTokenAdmin] = useState<string | null>(null);
  const router = useRouter();
  const onLogin = async (data: ILogin, action: FormikHelpers<ILogin>) => {
    try {
      const { result, ok } = await loginUser(data);
      console.log(result.data.token);
      if (ok && result.data.token) {
        setToken(result.data.token);
        toast.success('Login successful');
        action.resetForm();
        router.back();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = async () => {
    setToken('');
    toast.success('Logout successful');
    router.refresh();
  };

  const onLoginAdmin = async(data: ILoginAdmin, action: FormikHelpers<ILoginAdmin>) =>{
    try {
      const {result, ok} = await loginAdmin(data);
      console.log(result.data.token);
      if(ok && result.data.token){
        setTokenAdmin(result.data.token);
        toast.success('Login successful');
        action.resetForm();
        router.back();
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onLogoutAdmin = async() =>{
    setTokenAdmin('');
    toast.success('Logout successful');
    router.refresh();
  }
  return (
    <AuthContext.Provider value={{ token, onLogin, onLogout, onLoginAdmin, onLogoutAdmin}}>
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
