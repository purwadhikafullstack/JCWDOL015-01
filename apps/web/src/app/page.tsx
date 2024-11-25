'use client'
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-200 flex flex-col items-center justify-center space-y-8">
      <h1 className="text-5xl font-extrabold text-blue-600 drop-shadow-lg">
        Onto Employee
      </h1>
      <div className="flex flex-col space-y-4">
        <Link href="/subscriptions">
          <button className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
            Subscriptions List
          </button>
        </Link>
        <Link href="/review">
          <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition">
            Review
          </button>
        </Link>
        <Link href="/assessment">
          <button className="px-6 py-3 bg-purple-500 text-white font-semibold rounded-lg shadow hover:bg-purple-600 transition">
            Go to Assessment
          </button>
        </Link>
      </div>
    </div>

  );
}