'use client'
import { useRouter } from "next/navigation";

export default function BlockedAdmin() {
    const router = useRouter();
    const onClick = async () => {
        router.push("/admin/check-email");
    }
  return (
    <div className="w-full items-center">
      <h1 className="text-3xl font-semibold">Blocked</h1>
      <p className="text-lg mt-4">Your account has been blocked</p>
      <button onClick={onClick}>Click to Unblock</button>
    </div>
  );
}