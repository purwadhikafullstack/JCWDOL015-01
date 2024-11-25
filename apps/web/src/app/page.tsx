'use client'
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-500">Onto Employee</h1>
      <Link href={'/subscriptions'}><p>Subs List</p></Link>
      <Link href={'/review'}><p>Review</p></Link>
      <Link href={'/assessment'}><p>Go To Assessment</p></Link>
    </div>
  );
}