'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = 'http://localhost:5000';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError('Please enter a phone number');
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: formattedPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to send OTP');
        setLoading(false);
        return;
      }

      setError('');
      console.log('OTP sent:', data);
    } catch (err: unknown) {
      setError('An error occurred while sending OTP. Please try again.');
      if (err instanceof Error) {
        console.error('Send OTP error:', err.message);
      } else {
        console.error('Send OTP unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!phone || !otp || otp.length !== 6) {
      setError('Please enter a valid phone number and 6-digit OTP');
      setLoading(false);
      return;
    }

    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formattedPhone,
          code: otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'OTP verification failed');
        setLoading(false);
        return;
      }

      console.log('OTP verified:', data);
      router.push('/login'); // Redirect to login after verification
    } catch (err: unknown) {
      setError('An error occurred. Please try again.');
      if (err instanceof Error) {
        console.error('Verify OTP error:', err.message);
      } else {
        console.error('Verify OTP unknown error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Verify OTP</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your phone number (e.g., +1234567890)"
            pattern="\+?[0-9]{10,15}"
            title="Phone number should be 10-15 digits, optionally starting with +"
          />
        </div>
        <button
          type="button"
          onClick={handleSendOtp}
          className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition disabled:bg-green-400"
          disabled={loading}
        >
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
            OTP Code
          </label>
          <input
            type="text"
            name="otp"
            id="otp"
            value={otp}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Back to{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
