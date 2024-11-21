import Link from "next/link";

export default function Home() {
  const assesmentId = 1
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-500">Tailwind CSS Test</h1>
      <Link href={'/subscriptions'}><p>Subs List</p></Link>
      <Link href={'/review'}><p>Review</p></Link>
      <Link href={`/assessment/${assesmentId}`}><p>Go To Assessment</p></Link>
    </div>
  );
}