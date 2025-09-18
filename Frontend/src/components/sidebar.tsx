"use client";

import { Button } from '@/components/ui/button';
import { Home, Package, Users, BarChart, Settings } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin is authenticated
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/404found'); 
    }
  }, [router]);

  // If not authenticated, don't render the sidebar
  if (typeof window !== 'undefined' && !localStorage.getItem('adminToken')) {
    return null;
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden sm:block w-64 bg-white shadow-md h-screen p-4">
        <div className="text-2xl font-bold mb-6">E-Commerce</div>
        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/products">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
          </Link>
          <Link href="/dashboard/customers">
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Button>
          </Link>
          <Link href="/dashboard/analytics">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </nav>
      </div>
      {/* Mobile bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow flex justify-around items-center py-1 sm:hidden">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon" className="flex flex-col items-center">
            <Home className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/dashboard/products">
          <Button variant="ghost" size="icon" className="flex flex-col items-center">
            <Package className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/dashboard/customers">
          <Button variant="ghost" size="icon" className="flex flex-col items-center">
            <Users className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/dashboard/analytics">
          <Button variant="ghost" size="icon" className="flex flex-col items-center">
            <BarChart className="h-6 w-6" />
          </Button>
        </Link>
        <Link href="/dashboard/settings">
          <Button variant="ghost" size="icon" className="flex flex-col items-center">
            <Settings className="h-6 w-6" />
          </Button>
        </Link>
      </div>
    </>
  );
}