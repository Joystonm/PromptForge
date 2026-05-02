import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-6xl font-black text-indigo-400 mb-4">404</h1>
        <p className="text-gray-300 mb-6">Page not found</p>
        <Link href="/" className="btn-primary inline-flex">Go Home</Link>
      </div>
    </div>
  );
}
