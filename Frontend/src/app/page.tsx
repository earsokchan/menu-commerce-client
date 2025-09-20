"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, ChevronLeft, ChevronRight, Search, ShoppingCart, User } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';

interface Product {
  id: string;
  name: string;
  salePrice: number | null;
  riels: string;
  images: string[];
  badges: string[];
  category: string;
  sizes: string[];
}

interface MenuItem {
  id: string;
  name: string;
  salePrice: number | null;
  riels: string;
  image: string;
  badges: string[];
  size: string; // Make size required
}

interface Toast {
  id: number;
  message: string;
}

interface Category {
  id: string;
  name: string;
}

interface Banner {
  id: string;
  percentage: string;
  title: string;
  description: string;
  images: string[];
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductImages, setSelectedProductImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [banner, setBanner] = useState<Banner | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, getTotalItems } = useCartStore();

  // Add refs for caching
  const categoriesCache = React.useRef<Category[] | null>(null);
  const productsCache = React.useRef<{ [category: string]: Product[] }>({});

  // Fetch banner on component mount
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('https://menu-commerce-backend-production.up.railway.app/api/discount-banner');
        if (!response.ok) throw new Error('Failed to fetch discount banner');
        const data = await response.json();
        setBanner(data);
      } catch (err) {
        setError('Error fetching discount banner: ' + (err as Error).message);
      }
    };
    
    fetchBanner();
  }, []);

  // Fetch categories on component mount
  useEffect(() => {
    if (categoriesCache.current) {
      setCategories(categoriesCache.current);
      if (categoriesCache.current.length > 0) {
        setActiveCategory(categoriesCache.current[0].name);
      }
      return;
    }
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://menu-commerce-backend-production.up.railway.app/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        categoriesCache.current = data;
        if (data.length > 0) {
          setActiveCategory(data[0].name);
        }
      } catch (err) {
        setError('Error fetching categories: ' + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when active category changes
  useEffect(() => {
    if (activeCategory) {
      if (productsCache.current[activeCategory]) {
        setProducts(productsCache.current[activeCategory]);
        return;
      }
      fetchProducts(activeCategory);
    }
  }, [activeCategory]);

  const fetchProducts = async (category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `https://menu-commerce-backend-production.up.railway.app/api/products/category/${encodeURIComponent(category)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const parsedData = data.map((product: Product) => ({
        ...product,
        salePrice: product.salePrice != null && typeof product.salePrice === 'string' ? parseFloat(product.salePrice) : product.salePrice,
      }));
      setProducts(parsedData);
      productsCache.current[category] = parsedData;
    } catch (err) {
      setError('Error fetching products: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const transformToMenuItem = (product: Product): MenuItem => ({
    id: product.id,
    name: product.name,
    salePrice: typeof product.salePrice === 'number' ? product.salePrice : null,
    riels: product.riels,
    image: product.images[0] || 'https://via.placeholder.com/300',
    badges: product.badges,
    size: '', // Always provide a string for size
  });

  // Update handleViewImages to accept a Product
  const handleViewImages = (product: Product) => {
    setSelectedProduct(product);
    setSelectedProductImages(product.images);
    setCurrentImageIndex(0);
    showToast(`Viewing "${product.name}"`);
  };

  const closeModal = () => {
    setSelectedProductImages(null);
    setSelectedProduct(null);
    setCurrentImageIndex(0);
  };

  const prevImage = () => {
    if (selectedProductImages) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProductImages.length - 1 : prev - 1));
    }
  };

  const nextImage = () => {
    if (selectedProductImages) {
      setCurrentImageIndex((prev) => (prev === selectedProductImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(transformToMenuItem(product));
    showToast(`Added "${product.name}" to cart`);
    // Optionally scroll to toast area for visibility:
    // document.querySelector('.fixed.top-4.right-4')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Add animation/message logic for modal Add to Cart
  const handleAddToCartModal = (product: Product) => {
    handleAddToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1200);
  };

  // Add toast notification
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Loading Overlay */}
      {isLoading && categories.length === 0 && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white bg-opacity-90">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amber-500 border-solid mb-4"></div>
          <span className="text-lg font-semibold text-amber-600">សូមរង់ចាំ...</span>
        </div>
      )}

      {/* Header */}
      <header className="bg-black text-white px-4 py-3 sticky top-0 z-40 shadow-md rounded-b-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Left: Logo/Title */}
          <div className="flex-1 flex items-center">
            <h1 className="text-xl font-bold text-amber-500 tracking-wide">Pisey Salon</h1>
          </div>
          {/* Right: Icons */}
          
        </div>
        {/* Mobile-friendly category scroll */}
        <div className="flex overflow-x-auto gap-3 pb-2 pt-3 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.name)}
              className={`flex-shrink-0 px-5 py-2 text-xs uppercase rounded-full transition-all duration-200 ${
                activeCategory === category.name
                  ? 'bg-amber-500 text-white shadow-lg'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </header>

      {/* Discount Banner */}
      {banner && (
        <div className="relative w-full">
          <div className="max-w-[2380px] mx-auto px-4 py-8">
            {banner.images[0] && (
              <div className="relative w-full h-[150px] overflow-hidden rounded-2xl shadow-lg">
                <img
                  src={banner.images[0]}
                  alt="Discount Banner"
                  className="w-full h-full object-[center_top] object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/30">
                  <h2 className="text-4xl sm:text-5xl font-extrabold uppercase mb-4 drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <div className="flex items-baseline gap-2 drop-shadow-lg">
                    <span className="text-3xl sm:text-7xl font-bold text-amber-400">
                      {banner.percentage}
                    </span>
                    <span className="text-3xl sm:text-4xl font-bold text-amber-400">%</span>
                    <span className="text-xl sm:text-2xl">OFF</span>
                  </div>
                  <p className="text-base sm:text-lg mt-4 max-w-md drop-shadow-lg">
                    {banner.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-8">
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

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {categories.length > 0 && (
          <div className="w-full">
            {categories.map((category) => (
              <div key={category.id} className={activeCategory === category.name ? 'block' : 'hidden'}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">
                    {category.name}
                  </h2>

                  {isLoading ? (
                    // Skeleton Loading Animation
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {Array.from({ length: 8 }).map((_, idx) => (
                        <div key={idx} className="animate-pulse bg-white rounded-lg overflow-hidden shadow">
                          <div className="bg-gray-200 h-48 w-full" />
                          <div className="p-4">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-6 w-16 bg-gray-200 rounded" />
                              <div className="h-6 w-10 bg-gray-200 rounded" />
                            </div>
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                            <div className="h-8 bg-gray-200 rounded w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : products.length === 0 ? (
                    <p className="text-gray-500">No items found</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {products.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={item.images[0] || 'https://via.placeholder.com/300'}
                              alt={item.name}
                              className="w-full h-48 object-cover cursor-pointer"
                              onClick={() => handleViewImages(item)}
                            />
                            {item.badges.map((badge, index) => (
                              <Badge key={index} className={`absolute top-2 ${index === 0 ? 'left-2' : 'right-2'} ${
                                badge.includes('%') ? 'bg-amber-500' :
                                badge === 'Popular' ? 'bg-amber-600' :
                                badge === 'Recommended' ? 'bg-amber-700' :
                                badge === 'Special' ? 'bg-green-600' :
                                badge === 'New' ? 'bg-blue-600' :
                                'bg-gray-600'
                              } text-white`}>
                                {badge}
                              </Badge>
                            ))}
                          </div>

                          <CardContent className="p-4">
                            <div className="text-xs text-gray-500 mb-1">ID: {item.id}</div>
                            <h3 className="font-bold text-sm mb-2 text-gray-800 leading-tight">{item.name}</h3>

                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                {typeof item.salePrice === 'number' && item.salePrice !== null ? (
                                  <span className="text-lg font-bold text-amber-600">${item.salePrice.toFixed(2)}</span>
                                ) : (
                                  <span className="text-lg font-bold text-amber-600">$0.00</span>
                                )}
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 mb-2">{item.riels}</div>

                            <Button
                              onClick={() => handleAddToCart(item)}
                              className="w-full bg-black hover:bg-gray-800 text-white rounded-full"
                              size="sm"
                            >
                              <Plus className="w-4 h-4" /> Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for product images and details */}
        {selectedProductImages && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-3xl w-full relative">
              <Button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full z-50 p-2"
                size="icon"
              >
                <X className="w-6 h-6" />
              </Button>
              <div className="relative">
                <img
                  src={selectedProductImages[currentImageIndex] || 'https://via.placeholder.com/300'}
                  alt="Product"
                  className="w-full h-auto max-h-[50vh] object-contain"
                />
                {selectedProductImages.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
                      size="icon"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white rounded-full"
                      size="icon"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {selectedProductImages.map((image, index) => (
                  <img
                    key={index}
                    src={image || 'https://via.placeholder.com/300'}
                    alt={`Thumbnail ${index + 1}`}
                    className={`w-16 h-16 object-cover rounded cursor-pointer ${
                      index === currentImageIndex ? 'border-2 border-amber-500' : 'border border-gray-300'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
              {/* Product details */}
              <div className="mt-6">
                <h3 className="font-bold text-lg mb-2 text-gray-800">{selectedProduct.name}</h3>
                <div className="flex items-center gap-2 mb-2">
                  {selectedProduct.badges.map((badge, idx) => (
                    <Badge key={idx} className={
                      `${badge.includes('%') ? 'bg-amber-500' :
                        badge === 'Popular' ? 'bg-amber-600' :
                        badge === 'Recommended' ? 'bg-amber-700' :
                        badge === 'Special' ? 'bg-green-600' :
                        badge === 'New' ? 'bg-blue-600' :
                        'bg-gray-600'} text-white`
                    }>
                      {badge}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-lg font-bold text-amber-600">
                    {typeof selectedProduct.salePrice === 'number' && selectedProduct.salePrice !== null
                      ? `$${selectedProduct.salePrice.toFixed(2)}`
                      : '$0.00'}
                  </span>
                  <span className="text-xs text-gray-500">{selectedProduct.riels}</span>
                </div>
                <Button
                  onClick={() => handleAddToCartModal(selectedProduct)}
                  className="bg-black hover:bg-gray-800 text-white rounded-full mt-2"
                  size="sm"
                  disabled={addedToCart}
                >
                  <Plus className="w-4 h-4" /> Add to Cart
                </Button>
                {addedToCart && (
                  <div className="flex flex-col items-center mt-3 animate-fade-in">
                    <svg className="w-8 h-8 text-green-500 mb-1 animate-bounce" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-600 font-semibold text-sm">Added to cart!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-1 left-1/2 -translate-x-1/2 w-[95%] bg-black text-white rounded-2xl shadow-lg py-2 px-4 z-40 block">
        <div className="flex justify-around items-center">
          {/* Home */}
          <Link href="/" className="flex flex-col items-center gap-1 hover:text-amber-400 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
            </svg>
            <span className="text-[11px]">Home</span>
          </Link>

          {/* Search */}
          {/* <Link href="/" className="flex flex-col items-center gap-1 hover:text-amber-400 transition-colors">
            <Search className="w-6 h-6" />
            <span className="text-[11px]">Search</span>
          </Link> */}

          {/* Cart */}
          <Link href="/cart" className="flex flex-col items-center gap-1 relative hover:text-amber-400 transition-colors">
            <ShoppingCart className="w-6 h-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1.5 -right-3 bg-amber-500 text-black text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {getTotalItems()}
              </span>
            )}
            <span className="text-[11px]">Cart</span>
          </Link>

          {/* Account */}
          <button
            onClick={() => {}} // toggleUserMenu
            className="flex flex-col items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-[11px]">Account</span>
          </button>

          {/* More */}
          {/* <button
            onClick={() => {}} // handleMoreMenu
            className="flex flex-col items-center gap-1 hover:text-amber-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
            <span className="text-[11px]">More</span>
          </button> */}
        </div>
      </nav>

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
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }
        .animate-fade-in {
          animation: fade-in 0.4s;
        }
        .animate-bounce {
          animation: bounce 0.6s;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-8px);}
        }
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-600 {
          scrollbar-color: #4b5563 transparent;
        }
        .scrollbar-track-transparent {
          scrollbar-track-color: transparent;
        }
      `}</style>
    </div>
  );
}