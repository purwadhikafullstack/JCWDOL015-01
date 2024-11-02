import Link from 'next/link';

export default function AdminPage() {
  return (
    <div>
      <h1>Admin Page</h1>

      {/* can be used for section to redirect admins into login and signup */}
      <div className="flex flex-col items-center w-full">
        <div>
          <h2>Please join us bla bla bla below</h2>
        </div>
        <div className='flex flex-row gap-10 font-bold text-xl'>
          <Link href="/admin/login" className='p-4 border-black border-2 rounded-full hover:bg-amber-400 duration-300'>Login</Link>
          <Link href="/admin/signup" className='p-4 border-black border-2 rounded-full hover:bg-amber-400 duration-300'>Signup</Link>
        </div>
      </div>
    </div>
  );
}
