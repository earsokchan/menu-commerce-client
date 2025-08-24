'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import Sidebar from '@/components/sidebar';

export default function Analytics() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics</h1>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Sales Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64">
              <BarChart className="h-12 w-12 text-gray-400" />
              <p className="ml-4 text-gray-500">Analytics charts coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}