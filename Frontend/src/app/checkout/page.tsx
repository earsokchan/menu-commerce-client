"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';

export default function CheckoutPage() {
  const { items, getTotalPrice, getTotalItems } = useCartStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    province: '',
  });
  const [errors, setErrors] = useState({ name: '', email: '', phone: '', address: '', province: '' });

  const provinces = [
    'Banteay Meanchey',
    'Battambang',
    'Kampong Cham',
    'Kampong Chhnang',
    'Kampong Speu',
    'Kampong Thom',
    'Kampot',
    'Kandal',
    'Kep',
    'Koh Kong',
    'Kratié',
    'Mondulkiri',
    'Oddar Meanchey',
    'Pailin',
    'Phnom Penh',
    'Preah Sihanouk',
    'Preah Vihear',
    'Prey Veng',
    'Pursat',
    'Ratanakiri',
    'Siem Reap',
    'Stung Treng',
    'Svay Rieng',
    'Takéo',
    'Tboung Khmum'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleProvinceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, province: value }));
    setErrors((prev) => ({ ...prev, province: '' }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '', address: '', province: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    if (!formData.phone.match(/^\+?\d{10,15}$/)) {
      newErrors.phone = 'Valid phone number is required';
      isValid = false;
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    if (!formData.province) {
      newErrors.province = 'Province is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Order submitted:', { ...formData, items });
      // Handle order submission (e.g., API call)
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-black text-white px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/cart" className="flex items-center gap-2 sm:gap-4">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full" />
                <h1 className="text-xl sm:text-2xl font-bold text-amber-500">Chan dev</h1>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg font-semibold">Checkout</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="bg-white rounded-lg p-8 sm:p-12 shadow-sm">
            <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Add items to your cart before checking out.
            </p>
            <Link href="/">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base">
                Browse Menu
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-black text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/cart" className="flex items-center gap-2 sm:gap-4">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full" />
              <h1 className="text-xl sm:text-2xl font-bold text-amber-500">Chan dev</h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold">
              Checkout ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-gray-800">Customer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm sm:text-base text-gray-800">Full Name</label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="mt-1"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && (
                        <p id="name-error" className="text-red-600 text-xs mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm sm:text-base text-gray-800">Email</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && (
                        <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm sm:text-base text-gray-800">Phone Number</label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-red-600 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="address" className="text-sm sm:text-base text-gray-800">Delivery Address</label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1"
                      aria-invalid={!!errors.address}
                      aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                    {errors.address && (
                      <p id="address-error" className="text-red-600 text-xs mt-1">{errors.address}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="province" className="text-sm sm:text-base text-gray-800">Province</label>
                    <Select
                      name="province"
                      value={formData.province}
                      onValueChange={handleProvinceChange}
                      aria-invalid={!!errors.province}
                      aria-describedby={errors.province ? 'province-error' : undefined}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 overflow-y-auto">
                        {provinces.map((province) => (
                          <SelectItem key={province} value={province}>
                            {province}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.province && (
                      <p id="province-error" className="text-red-600 text-xs mt-1">{errors.province}</p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm sm:text-base">
                      <span>
                        {item.name} ({item.quantity} x ${item.salePrice?.toFixed(2) || '0.00'})
                      </span>
                      <span>${((item.salePrice || 0) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Delivery Fee</span>
                  <span>$2.00</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span>Total</span>
                  <span>${(getTotalPrice() + 2).toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleSubmit}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 text-sm sm:text-lg font-semibold mt-6"
                  disabled={items.length === 0}
                >
                  Place Order
                </Button>

                <Button
                  variant="outline"
                  className="w-full mt-3 text-sm sm:text-base"
                  asChild
                >
                  <Link href="/cart">Back to Cart</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}