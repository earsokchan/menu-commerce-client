// "use client";

// import React, { useState } from 'react';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
// import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
// import Link from 'next/link';
// import { useCartStore } from '@/lib/cart-store';

// interface Toast {
//   id: number;
//   message: string;
// }

// export default function CartPage() {
//   const { items, updateQuantity, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
//   const [toasts, setToasts] = useState<Toast[]>([]);
//   const [isCheckout, setIsCheckout] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     province: '',
//   });
//   const [errors, setErrors] = useState({ name: '', email: '', phone: '', address: '', province: '' });

//   const provinces = [
//     'Banteay Meanchey',
//     'Battambang',
//     'Kampong Cham',
//     'Kampong Chhnang',
//     'Kampong Speu',
//     'Kampong Thom',
//     'Kampot',
//     'Kandal',
//     'Kep',
//     'Koh Kong',
//     'Kratié',
//     'Mondulkiri',
//     'Oddar Meanchey',
//     'Pailin',
//     'Phnom Penh',
//     'Preah Sihanouk',
//     'Preah Vihear',
//     'Prey Veng',
//     'Pursat',
//     'Ratanakiri',
//     'Siem Reap',
//     'Stung Treng',
//     'Svay Rieng',
//     'Takéo',
//     'Tboung Khmum'
//   ];

//   // Add toast notification
//   const showToast = (message: string) => {
//     const id = Date.now();
//     setToasts((prev) => [...prev, { id, message }]);
//     setTimeout(() => {
//       setToasts((prev) => prev.filter((toast) => toast.id !== id));
//     }, 3000);
//   };

//   // Handle checkout click
//   const handleCheckout = () => {
//     setIsCheckout(true);
//   };

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: '' }));
//   };

//   // Handle province selection
//   const handleProvinceChange = (value: string) => {
//     setFormData((prev) => ({ ...prev, province: value }));
//     setErrors((prev) => ({ ...prev, province: '' }));
//   };

//   // Validate checkout form
//   const validateForm = () => {
//     let isValid = true;
//     const newErrors = { name: '', email: '', phone: '', address: '', province: '' };

//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//       isValid = false;
//     }
//     if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//       newErrors.email = 'Valid email is required';
//       isValid = false;
//     }
//     if (!formData.phone.match(/^\+?\d{10,15}$/)) {
//       newErrors.phone = 'Valid phone number is required';
//       isValid = false;
//     }
//     if (!formData.address.trim()) {
//       newErrors.address = 'Address is required';
//       isValid = false;
//     }
//     if (!formData.province) {
//       newErrors.province = 'Province is required';
//       isValid = false;
//     }

//     setErrors(newErrors);
//     return isValid;
//   };

//   // Handle order submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const orderData = {
//           customerName: formData.name,
//           email: formData.email,
//           phoneNumber: formData.phone,
//           deliveryAddress: formData.address,
//           province: formData.province,
//           items: items.map(item => ({
//             productId: item.id,
//             productName: item.name,
//             imageUrl: item.image,
//             price: item.salePrice || 0,
//             quantity: item.quantity,
//             size: item.size || '',
//             badges: item.badges || []
//           })),
//           subtotal: getTotalPrice(),
//           deliveryFee: 2.00,
//           total: getTotalPrice() + 2.00
//         };

//         const response = await fetch('https://graph-controller-admissions-picks.trycloudflare.com/api/orders', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(orderData),
//         });

//         if (response.ok) {
//           const result = await response.json();
//           showToast('Order placed successfully!');
//           clearCart();
//           // Redirect to confirmation page or home
//           setTimeout(() => {
//             window.location.href = '/';
//           }, 2000);
//         } else {
//           const errorData = await response.json();
//           showToast(`Failed to place order: ${errorData.error}`);
//         }
//       } catch (error) {
//         console.error('Error submitting order:', error);
//         showToast('Network error. Please check your connection.');
//       }
//     }
//   };

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Header */}
//         <header className="bg-black text-white px-4 py-4">
//           <div className="max-w-7xl mx-auto flex items-center justify-between">
//             <Link href="/" className="flex items-center gap-2 sm:gap-4">
//               <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
//               <div className="flex items-center gap-2 sm:gap-4">
//                 <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full" />
//                 <h1 className="text-xl sm:text-2xl font-bold text-amber-500">Pisey Salon</h1>
//               </div>
//             </Link>
//             <div className="flex items-center gap-2">
//               <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
//               <span className="text-base sm:text-lg font-semibold">{isCheckout ? 'Checkout' : 'Your Cart'}</span>
//             </div>
//           </div>
//         </header>

//         {/* Empty Cart */}
//         <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
//           <div className="bg-white rounded-lg p-8 sm:p-12 shadow-sm">
//             <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
//             <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
//             <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
//               Add some delicious items from our menu to get started!
//             </p>
//             <Link href="/">
//               <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 sm:px-8 sm:py-3 text-sm sm:text-base">
//                 Browse Menu
//               </Button>
//             </Link>
//           </div>
//         </main>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-black text-white px-4 py-4">
//         <div className="max-w-7xl mx-auto flex items-center justify-between">
//           <Link href="/" className="flex items-center gap-2 sm:gap-4">
//             <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
//             <div className="flex items-center gap-2 sm:gap-4">
//               <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full" />
//               <h1 className="text-xl sm:text-2xl font-bold text-amber-500">Pisey Salon</h1>
//             </div>
//           </Link>
//           <div className="flex items-center gap-2">
//             <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
//             <span className="text-base sm:text-lg font-semibold">
//               {isCheckout ? `Checkout (${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'})` : `Your Cart (${getTotalItems()} ${getTotalItems() === 1 ? 'item' : 'items'})`}
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
//         <div className="fixed top-4 right-4 z-50">
//           {toasts.map((toast) => (
//             <div
//               key={toast.id}
//               className="mb-2 bg-amber-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in"
//             >
//               {toast.message}
//             </div>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {isCheckout ? (
//             // Checkout Section
//             <div className="lg:col-span-2 space-y-6">
//               <Card className="shadow-sm">
//                 <CardHeader>
//                   <CardTitle className="text-lg sm:text-xl text-gray-800">Customer Information</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label htmlFor="name" className="text-sm sm:text-base text-gray-800">Full Name</label>
//                         <Input
//                           id="name"
//                           name="name"
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="mt-1"
//                           aria-invalid={!!errors.name}
//                           aria-describedby={errors.name ? 'name-error' : undefined}
//                         />
//                         {errors.name && (
//                           <p id="name-error" className="text-red-600 text-xs mt-1">{errors.name}</p>
//                         )}
//                       </div>
//                       <div>
//                         <label htmlFor="email" className="text-sm sm:text-base text-gray-800">Email</label>
//                         <Input
//                           id="email"
//                           name="email"
//                           type="email"
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="mt-1"
//                           aria-invalid={!!errors.email}
//                           aria-describedby={errors.email ? 'email-error' : undefined}
//                         />
//                         {errors.email && (
//                           <p id="email-error" className="text-red-600 text-xs mt-1">{errors.email}</p>
//                         )}
//                       </div>
//                     </div>
//                     <div>
//                       <label htmlFor="phone" className="text-sm sm:text-base text-gray-800">Phone Number</label>
//                       <Input
//                         id="phone"
//                         name="phone"
//                         type="tel"
//                         value={formData.phone}
//                         onChange={handleInputChange}
//                         className="mt-1"
//                         aria-invalid={!!errors.phone}
//                         aria-describedby={errors.phone ? 'phone-error' : undefined}
//                       />
//                       {errors.phone && (
//                         <p id="phone-error" className="text-red-600 text-xs mt-1">{errors.phone}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label htmlFor="address" className="text-sm sm:text-base text-gray-800">Delivery Address</label>
//                       <Input
//                         id="address"
//                         name="address"
//                         value={formData.address}
//                         onChange={handleInputChange}
//                         className="mt-1"
//                         aria-invalid={!!errors.address}
//                         aria-describedby={errors.address ? 'address-error' : undefined}
//                       />
//                       {errors.address && (
//                         <p id="address-error" className="text-red-600 text-xs mt-1">{errors.address}</p>
//                       )}
//                     </div>
//                     <div>
//                       <label htmlFor="province" className="text-sm sm:text-base text-gray-800">Province</label>
//                       <Select
//                         name="province"
//                         value={formData.province}
//                         onValueChange={handleProvinceChange}
//                         aria-invalid={!!errors.province}
//                         aria-describedby={errors.province ? 'province-error' : undefined}
//                       >
//                         <SelectTrigger className="mt-1">
//                           <SelectValue placeholder="Select a province" />
//                         </SelectTrigger>
//                         <SelectContent className="max-h-60 overflow-y-auto">
//                           {provinces.map((province) => (
//                             <SelectItem key={province} value={province}>
//                               {province}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       {errors.province && (
//                         <p id="province-error" className="text-red-600 text-xs mt-1">{errors.province}</p>
//                       )}
//                     </div>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>
//           ) : (
//             // Cart Section
//             <div className="lg:col-span-2 space-y-4">
//               <div className="flex items-center justify-between mb-4 sm:mb-6">
//                 <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Cart Items</h2>
//                 <Button
//                   variant="outline"
//                   onClick={clearCart}
//                   className="text-red-600 border-red-200 hover:bg-red-50 text-sm sm:text-base"
//                   aria-label="Clear cart"
//                 >
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Clear Cart
//                 </Button>
//               </div>

//               {items.map((item) => (
//                 <Card
//                   key={`${item.id}-${item.size}-${Date.now()}`}
//                   className="overflow-hidden shadow-sm"
//                 >
//                   <CardContent className="p-4 sm:p-6">
//                     <div className="flex flex-col sm:flex-row gap-4">
//                       <img
//                         src={item.image}
//                         alt={item.name}
//                         className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
//                         loading="lazy"
//                       />

//                       <div className="flex-1 space-y-2">
//                         <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
//                           <div>
//                             <h3 className="font-bold text-gray-800 text-base sm:text-lg">{item.name}</h3>
//                             <p className="text-xs sm:text-sm text-gray-500">ID: {item.id}</p>
//                             {item.badges?.length > 0 && (
//                               <div className="flex flex-wrap gap-1 mt-2">
//                                 {item.badges.map((badge, index) => (
//                                   <Badge
//                                     key={index}
//                                     className={`text-xs ${
//                                       badge.includes('%') ? 'bg-amber-500' :
//                                       badge === 'Popular' ? 'bg-amber-600' :
//                                       badge === 'Recommended' ? 'bg-amber-700' :
//                                       badge === 'Special' ? 'bg-green-600' :
//                                       badge === 'Vegan' ? 'bg-green-500' :
//                                       'bg-gray-600'
//                                     } text-white`}
//                                   >
//                                     {badge}
//                                   </Badge>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeItem(item.id, item.size)}
//                             className="text-red-600 hover:text-red-800 hover:bg-red-50"
//                             aria-label={`Remove ${item.name} from cart`}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         </div>

//                         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                           <div className="flex items-center gap-2">
//                             <span className="text-lg sm:text-xl font-bold text-amber-600">
//                               {item.salePrice ? `$${item.salePrice.toFixed(2)}` : '$0.00'}
//                             </span>
//                             <span className="text-xs sm:text-sm text-gray-500">({item.riels})</span>
//                           </div>

//                           <div className="flex items-center gap-2 sm:gap-3">
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1), item.size)}
//                               className="w-8 h-8 p-0"
//                               aria-label={`Decrease quantity of ${item.name}`}
//                             >
//                               <Minus className="w-4 h-4" />
//                             </Button>
//                             <span className="font-semibold text-base sm:text-lg min-w-[2rem] text-center">
//                               {item.quantity}
//                             </span>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => updateQuantity(item.id, item.quantity + 1, item.size)}
//                               className="w-8 h-8 p-0"
//                               aria-label={`Increase quantity of ${item.name}`}
//                             >
//                               <Plus className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </div>

//                         <div className="text-right mt-2">
//                           <span className="text-base sm:text-lg font-semibold text-gray-800">
//                             Subtotal: ${((item.salePrice || 0) * item.quantity).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-4 shadow-sm">
//               <CardHeader>
//                 <CardTitle className="text-lg sm:text-xl text-gray-800">Order Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 {isCheckout && (
//                   <div className="space-y-2">
//                     {items.map((item) => (
//                       <div key={`${item.id}-${item.size}`} className="flex justify-between text-sm sm:text-base">
//                         <span>
//                           {item.name} ({item.quantity} x ${item.salePrice?.toFixed(2) || '0.00'})
//                         </span>
//                         <span>${((item.salePrice || 0) * item.quantity).toFixed(2)}</span>
//                       </div>
//                     ))}
//                     <hr className="border-gray-200" />
//                   </div>
//                 )}
//                 <div className="flex justify-between text-sm sm:text-base">
//                   <span>Subtotal ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})</span>
//                   <span>${getTotalPrice().toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm sm:text-base">
//                   <span>Delivery Fee</span>
//                   <span>$2.00</span>
//                 </div>
//                 <hr className="border-gray-200" />
//                 <div className="flex justify-between text-base sm:text-lg font-bold">
//                   <span>Total</span>
//                   <span>${(getTotalPrice() + 2).toFixed(2)}</span>
//                 </div>

//                 {isCheckout ? (
//                   <>
//                     <Button
//                       onClick={handleSubmit}
//                       className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 text-sm sm:text-lg font-semibold mt-6"
//                       disabled={items.length === 0}
//                     >
//                       Place Order
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="w-full mt-3 text-sm sm:text-base"
//                       onClick={() => setIsCheckout(false)}
//                     >
//                       Back to Cart
//                     </Button>
//                   </>
//                 ) : (
//                   <>
//                     <Button
//                       className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 text-sm sm:text-lg font-semibold mt-6"
//                       onClick={handleCheckout}
//                     >
//                       Proceed to Checkout
//                     </Button>
//                     <Button
//                       variant="outline"
//                       className="w-full mt-3 text-sm sm:text-base"
//                       asChild
//                     >
//                       <Link href="/">Continue Shopping</Link>
//                     </Button>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>

//       <style jsx>{`
//         @keyframes slide-in {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }
//         .animate-slide-in {
//           animation: slide-in 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }









"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

interface Toast {
  id: number;
  message: string;
}

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Toast notification
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Handle "Place Order" -> Telegram
  const handleSubmit = async () => {
    try {
      if (items.length === 0) {
        showToast("Your cart is empty.");
        return;
      }

      // Format cart items without size
      const cartText = items
        .map(
          (item, index) =>
            `${index + 1}. ${item.name} (x${item.quantity}) - $${
              item.salePrice ? item.salePrice.toFixed(2) : "0.00"
            }%0AProduct: ${item.image}`
        )
        .join("%0A%0A"); // blank line between items

      const message = `🛒My Order:%0A%0A${cartText}%0A%0ATotal: $${(
        getTotalPrice() + 2
      ).toFixed(2)} (incl. $2 delivery)`;

      // Open Telegram with pre-filled message
      const telegramLink = `https://t.me/Pisey_salon?text=${message}`;
      window.open(telegramLink, "_blank");

      // Clear cart
      clearCart();
      showToast("Redirecting to Telegram...");
    } catch (error) {
      console.error("Error opening Telegram:", error);
      showToast("Failed to open Telegram. Please try again.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-black text-white px-4 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 sm:gap-4">
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full" />
                <h1 className="text-xl sm:text-2xl font-bold text-amber-500">
                  Pisey Salon
                </h1>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-base sm:text-lg font-semibold">
                Your Cart
              </span>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <main className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="bg-white rounded-lg p-8 sm:p-12 shadow-sm">
            <ShoppingCart className="w-16 h-16 sm:w-24 sm:h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              Add some delicious items from our menu to get started!
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
      {/* Header */}
      <header className="bg-black text-white px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-4">
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full" />
              <h1 className="text-xl sm:text-2xl font-bold text-amber-500">
                Pisey Salon
              </h1>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-base sm:text-lg font-semibold">
              Your Cart ({getTotalItems()}{" "}
              {getTotalItems() === 1 ? "item" : "items"})
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="fixed top-4 right-4 z-50">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="mb-2 bg-amber-500 text-white px-4 py-2 rounded shadow-lg animate-slide-in"
            >
              {toast.message}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                Cart Items
              </h2>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50 text-sm sm:text-base"
                aria-label="Clear cart"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {items.map((item) => (
              <Card
                key={`${item.id}-${item.size}-${Date.now()}`}
                className="overflow-hidden shadow-sm"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                    />

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-base sm:text-lg">
                            {item.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            ID: {item.id}
                          </p>
                          {item.badges?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.badges.map((badge, index) => (
                                <Badge
                                  key={index}
                                  className={`text-xs ${
                                    badge.includes("%")
                                      ? "bg-amber-500"
                                      : badge === "Popular"
                                      ? "bg-amber-600"
                                      : badge === "Recommended"
                                      ? "bg-amber-700"
                                      : badge === "Special"
                                      ? "bg-green-600"
                                      : badge === "Vegan"
                                      ? "bg-green-500"
                                      : "bg-gray-600"
                                  } text-white`}
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg sm:text-xl font-bold text-amber-600">
                            {item.salePrice
                              ? `$${item.salePrice.toFixed(2)}`
                              : "$0.00"}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            ({item.riels})
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                Math.max(0, item.quantity - 1),
                                item.size
                              )
                            }
                            className="w-8 h-8 p-0"
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold text-base sm:text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.size
                              )
                            }
                            className="w-8 h-8 p-0"
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-right mt-2">
                        <span className="text-base sm:text-lg font-semibold text-gray-800">
                          Subtotal: $
                          {((item.salePrice || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl text-gray-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>
                    Subtotal ({getTotalItems()}{" "}
                    {getTotalItems() === 1 ? "item" : "items"})
                  </span>
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
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 sm:py-3 text-sm sm:text-lg font-semibold mt-6"
                  onClick={handleSubmit}
                  disabled={items.length === 0}
                >
                  Place Order
                </Button>
                <Button
                  variant="outline"
                  className="w-full mt-3 text-sm sm:text-base"
                  asChild
                >
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
