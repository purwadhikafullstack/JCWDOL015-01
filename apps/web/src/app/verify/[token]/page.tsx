'use client';
import Wrapper from '@/components/wrapper';
import { verifyUser } from '@/lib/user';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function Verify() {
  const params = useParams();
  const token = Array.isArray(params?.token) ? params.token[0] : params?.token;
  const router = useRouter();

  const onVerify = async () => {
    if (!token) return;
    try {
      const { result, ok } = await verifyUser(token);
      if (!ok) throw result.msg;
      toast.success('Verification successful');
      router.push('/user/login');
    } catch (err: any) {
      console.log(err);
      toast.error(err as string);
    }
  };

  useEffect(() => {
    onVerify();
  });
  return (
    <Wrapper>
      <div className="mt-10 font-extrabold text-5xl">
        Verification in progress...
      </div>
    </Wrapper>
  );
}
