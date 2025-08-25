// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Head from 'next/head';
// import Link from 'next/link';

// export default function AdminLogin() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const router = useRouter();

//   // Get admin credentials from environment variables
//   const ADMIN_CREDENTIALS = {
//     email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
//     password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     // Basic validation
//     if (!email || !password) {
//       setError('Please fill in all fields');
//       setLoading(false);
//       return;
//     }

//     if (!/\S+@\S+\.\S+/.test(email)) {
//       setError('Please enter a valid email');
//       setLoading(false);
//       return;
//     }

//     try {
//       // Simulate API call delay
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       // Check credentials against environment variables
//       if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
//         throw new Error('Invalid credentials');
//       }

//       // Successful login
//       setSuccess(true);
      
//       // Store dummy admin data in localStorage
//       localStorage.setItem('adminToken', 'dummy-admin-token');
//       localStorage.setItem('adminUser', JSON.stringify({
//         id: 1,
//         name: 'Admin User',
//         email: ADMIN_CREDENTIALS.email,
//         role: 'admin'
//       }));

//       // Redirect to admin dashboard after a brief delay
//       setTimeout(() => {
//         router.push('/dashboard');
//       }, 1500);

//     } catch (err) {
//       console.error('Login error:', err);
//       setError(err.message || 'An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ... rest of the component remains the same ...
//   return (
//     <>
//       <Head>
//         <title>Admin Login</title>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       </Head>
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
//           <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
          
//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
//               {error}
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
//               Login successful! Redirecting to dashboard...
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="admin@example.com"
//                 required
//               />
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 placeholder="********"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className={`w-full p-2 rounded transition duration-200 ${
//                 loading
//                   ? 'bg-blue-400 cursor-not-allowed'
//                   : 'bg-blue-600 hover:bg-blue-700 text-white'
//               }`}
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Logging in...
//                 </span>
//               ) : (
//                 'Log In'
//               )}
//             </button>
//           </form>

//           <div className="mt-4 text-center text-sm text-gray-600">
//             <Link href="/" className="text-blue-600 hover:underline">
//               ← Back to main site
//             </Link>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Get admin credentials from environment variables
  const ADMIN_CREDENTIALS = {
    email: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    password: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check credentials against environment variables
      if (
        email !== ADMIN_CREDENTIALS.email ||
        password !== ADMIN_CREDENTIALS.password
      ) {
        throw new Error("Invalid credentials");
      }

      // Successful login
      setSuccess(true);

      // Store dummy admin data in localStorage
      localStorage.setItem("adminToken", "dummy-admin-token");
      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          id: 1,
          name: "Admin User",
          email: ADMIN_CREDENTIALS.email,
          role: "admin",
        })
      );

      // Redirect to admin dashboard after a brief delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Admin Login
          </h1>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
              Login successful! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="********"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-2 rounded transition duration-200 ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 
12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-600">
            <Link href="/" className="text-blue-600 hover:underline">
              ← Back to main site
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
