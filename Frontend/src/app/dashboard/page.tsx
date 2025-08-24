'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import DashboardCard from '@/components/DashboardCard';
import Sidebar from '@/components/sidebar';
import { DollarSign, ShoppingCart, Users, BarChart } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data for demonstration
  const metrics = {
    totalSales: 125000,
    totalOrders: 245,
    totalCustomers: 1800,
    conversionRate: 3.5,
  };

  const recentOrders = [
    { id: 'ORD001', customer: 'John Doe', total: 150.00, status: 'Completed', date: '2025-07-27' },
    { id: 'ORD002', customer: 'Jane Smith', total: 89.99, status: 'Pending', date: '2025-07-26' },
    { id: 'ORD003', customer: 'Bob Johnson', total: 249.50, status: 'Shipped', date: '2025-07-25' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">E-Commerce Dashboard</h1>
          <div className="space-x-2">
            <Button
              variant={timeRange === '7d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('7d')}
            >
              Last 7 Days
            </Button>
            <Button
              variant={timeRange === '30d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('30d')}
            >
              Last 30 Days
            </Button>
            <Button
              variant={timeRange === '90d' ? 'default' : 'outline'}
              onClick={() => setTimeRange('90d')}
            >
              Last 90 Days
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <DashboardCard
            title="Total Sales"
            value={`$${metrics.totalSales.toLocaleString()}`}
            icon={<DollarSign className="h-6 w-6 text-green-500" />}
            change="+12.5%"
          />
          <DashboardCard
            title="Total Orders"
            value={metrics.totalOrders.toString()}
            icon={<ShoppingCart className="h-6 w-6 text-blue-500" />}
            change="+8.3%"
          />
          <DashboardCard
            title="Total Customers"
            value={metrics.totalCustomers.toString()}
            icon={<Users className="h-6 w-6 text-purple-500" />}
            change="+5.1%"
          />
          <DashboardCard
            title="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            icon={<BarChart className="h-6 w-6 text-orange-500" />}
            change="-0.2%"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant={order.status === 'Completed' ? 'default' : 'secondary'}
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}