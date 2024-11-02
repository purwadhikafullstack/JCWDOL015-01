'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../authContext/AuthContext';
import { usePathname } from 'next/navigation';

export const Header = () => {
  const { token, onLogout } = useAuth();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex flex-row p-2 h-20 w-full items-center justify-between gap-5 bg-blue-600 text-white font-bold">
      {/* Logo */}
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
      {/* Utilities */}
      <div className="flex flex-row justify-center gap-3 h-20 items-center">
        {isActive('/jobs') ? (
          <span className="border-amber-400 border-y-8 h-20 flex items-center duration-100">
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
          <span className="border-amber-400 border-y-8 h-20 flex items-center duration-100">
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
        {isActive('/companies') ? (
          <span className="border-amber-400 border-y-8 h-20 flex items-center duration-100">
            Our Affiliates
          </span>
        ) : (
          <Link
            href="/companies"
            className="border-white hover:border-y-8 h-20 flex items-center duration-100"
          >
            Our Affiliates
          </Link>
        )}
      </div>
      {/* Auth */}
      <div className="flex flex-row justify-center gap-2">
        {isAdmin ? (
          <span className="border-amber-400 border-y-8 h-20 flex items-center duration-100">
            For Admin
          </span>
        ) : (
          <div className="flex flex-row justify-center gap-2">
            <Link
              href="/admin"
              className="border-white hover:border-y-8 h-20 flex items-center duration-100"
            >
              For Admin
            </Link>
            <div className="flex items-center">|</div>
            {token ? (
              <div className="flex flex-row justify-center gap-2">
                <Link href="/user/dashboard" className="flex items-center">
                  Dashboard
                </Link>
                <button onClick={onLogout} className="flex items-center">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-row justify-center gap-2">
                <Link href="/user/login" className="flex items-center">
                  Login
                </Link>
                <Link href="/user/register" className="flex items-center">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center">|</div>
        <div className="flex items-center">Toggle Language</div>
      </div>
    </div>
  );
};
