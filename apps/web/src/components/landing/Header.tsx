'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../authContext/Provider';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const { token, onLogout, adminToken, onAdminLogout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex flex-row p-2 h-20 w-full items-center justify-between gap-5 bg-blue-600 text-white font-bold">
      <div className="ml-10">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="logo"
            width={1598}
            height={419}
            className="w-60 h-16"
          />
        </Link>
      </div>
      <div className="flex flex-row justify-center gap-3 h-20 items-center">
        {isActive('/jobs') ? (
          <span className="border-cyan-500 border-y-8 h-20 flex items-center duration-100">
            Look for Jobs
          </span>
        ) : (
          <Link
            href="/jobs"
            className="border-white hover:border-y-8 h-20 flex items-center duration-100"
          >
            Look for Jobs
          </Link>
        )}
        <div>|</div>
        {isActive('/skill') ? (
          <span className="border-cyan-500 border-y-8 h-20 flex items-center duration-100">
            Skill Tests
          </span>
        ) : (
          <Link
            href="/skill"
            className="border-white hover:border-y-8 h-20 flex items-center duration-100"
          >
            Skill Tests
          </Link>
        )}
        <div>|</div>
        {isActive('/company') ? (
          <span className="border-cyan-500 border-y-8 h-20 flex items-center duration-100">
            Our Affiliates
          </span>
        ) : (
          <Link
            href="/company"
            className="border-white hover:border-y-8 h-20 flex items-center duration-100"
          >
            Our Affiliates
          </Link>
        )}
      </div>
      <div className="flex flex-row justify-center gap-2">
        {adminToken ? (
          <>
            <Link
              href="/admin/dashboard"
              className="border-white hover:border-y-8 h-20 flex items-center duration-100"
            >
              For Admin
            </Link>

            <div className="flex items-center">|</div>
            <Link href="/admin/dashboard" className="flex items-center">
              Dashboard
            </Link>
            <button onClick={onAdminLogout} className="flex items-center">
              Logout
            </button>
          </>
        ) : token ? (
          <>
            <Link href="/user/dashboard" className="flex items-center">
              Dashboard
            </Link>
            <button onClick={onLogout} className="flex items-center">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/admin"
              className="border-white hover:border-y-8 h-20 flex items-center duration-100"
            >
              For Admin
            </Link>

            {isActive('/admin') ? null : (
              <>
                <div className="flex items-center">|</div>
                <Link href="/user/login" className="flex items-center">
                  Login
                </Link>
                <Link href="/user/register" className="flex items-center">
                  Sign Up
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
