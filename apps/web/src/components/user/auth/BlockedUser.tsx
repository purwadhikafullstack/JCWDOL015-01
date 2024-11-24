'use client'
import { useRouter } from "next/navigation";

export default function BlockedUser() {
    const router = useRouter();
    const onClick = async () => {
        router.push("/user/check-email");
    }
  return (
    <div className="w-full h-full m-80 items-center text-center">
      <h1 className="text-3xl font-semibold">Blocked</h1>
      <p className="text-lg mt-4">Your account has been blocked</p>
      <button onClick={onClick} className="button p-10 border-2 rounded-full">Click to Unblock</button>
    </div>
  );
}