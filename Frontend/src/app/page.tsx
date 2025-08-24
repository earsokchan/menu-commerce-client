"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, ShoppingCart, X, ChevronLeft, ChevronRight, Menu, User } from 'lucide-react';
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
  size: string;
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

const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductImages, setSelectedProductImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [banner, setBanner] = useState<Banner | null>(null);
  const { addItem, getTotalItems } = useCartStore();

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // Fetch banner on component mount
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/discount-banner');
        if (!response.ok) throw new Error('Failed to fetch discount banner');
        const data = await response.json();
        setBanner(data);
      } catch (err) {
        setError('Error fetching discount banner: ' + (err as Error).message);
      }
    };
    
    fetchBanner();
  }, []);

  // Add toast notification
  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    showToast('Logged out successfully');
  };

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
        if (data.length > 0) {
          setActiveCategory(data[0].name);
        }
      } catch (err) {
        setError('Error fetching categories: ' + (err as Error).message);
      }
    };
    
    fetchCategories();
  }, []);

  // Fetch products when active category changes
  useEffect(() => {
    if (activeCategory) {
      fetchProducts(activeCategory);
    }
  }, [activeCategory]);

  const fetchProducts = async (category: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = `http://localhost:5000/api/products/category/${encodeURIComponent(category)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      const parsedData = data.map((product: Product) => ({
        ...product,
        salePrice: product.salePrice != null && typeof product.salePrice === 'string' ? parseFloat(product.salePrice) : product.salePrice,
        sizes: product.sizes || AVAILABLE_SIZES,
      }));
      setProducts(parsedData);
      // Clear selectedSizes to ensure dropdowns start with "Select size"
      setSelectedSizes({});
    } catch (err) {
      setError('Error fetching products: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const transformToMenuItem = (product: Product, size: string): MenuItem => ({
    id: product.id,
    name: product.name,
    salePrice: typeof product.salePrice === 'number' ? product.salePrice : null,
    riels: product.riels,
    image: product.images[0] || 'https://via.placeholder.com/300',
    badges: product.badges,
    size: size,
  });

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSizeChange = (productId: string, size: string) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size
    }));
  };

  const handleViewImages = (images: string[]) => {
    setSelectedProductImages(images);
    setCurrentImageIndex(0);
  };

  const closeModal = () => {
    setSelectedProductImages(null);
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

  const handleAddToCart = (product: Product, size: string) => {
    addItem(transformToMenuItem(product, size));
    showToast(`Added ${product.name} (${size})`);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-black text-white px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                onClick={toggleMenu}
                className="lg:hidden bg-transparent hover:bg-gray-800 text-white"
                size="icon"
              >
                <Menu className="w-6 h-6" />
              </Button>
              <h1 className="text-2xl font-bold text-amber-500">404found</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Button
                  onClick={toggleUserMenu}
                  className="bg-transparent hover:bg-gray-800 text-white"
                  size="icon"
                >
                  <User className="w-6 h-6" />
                </Button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                    {isLoggedIn ? (
                      <div
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={handleLogout}
                      >
                        Logout
                      </div>
                    ) : (
                      <>
                        <Link href="/login">
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                            Login
                          </div>
                        </Link>
                        <Link href="/signup">
                          <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsUserMenuOpen(false)}>
                            Signup
                          </div>
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
              <Link href="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 hover:text-amber-400 transition-colors cursor-pointer" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-500 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              className="pl-10 bg-white text-black"
              placeholder="SEARCH WITHIN THE MENU"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hidden lg:block">
            <Tabs value={activeCategory || ''} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid grid-cols-3 lg:grid-cols-6 bg-gray-800 h-auto p-1">
                {categories.map(category => (
                  <TabsTrigger key={category.id} value={category.name} className="text-xs px-2 py-2 uppercase">
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-black text-white transform ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out z-50 lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold text-amber-500">Categories</h2>
          <Button
            onClick={toggleMenu}
            className="bg-transparent hover:bg-gray-800 text-white"
            size="icon"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
        <nav className="p-4">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => {
                setActiveCategory(category.name);
                setIsMenuOpen(false);
              }}
              className={`block w-full text-left py-2 px-4 rounded uppercase ${
                activeCategory === category.name
                  ? 'bg-amber-500 text-black'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMenu}
        ></div>
      )}

      {/* Discount Banner */}
      {banner && (
        <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-4xl lg:text-6xl font-bold mb-2">
                  <span className="text-white">{banner.title}</span>
                  <div className="flex items-baseline">
                    <span className="text-6xl lg:text-8xl text-amber-400">{banner.percentage}</span>
                    <span className="text-3xl lg:text-4xl text-amber-400">%</span>
                  </div>
                  <div className="text-lg lg:text-xl font-normal">
                    <span className="text-white">{banner.description}</span> <span className="text-amber-400">OFF</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {banner.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Banner image ${index + 1}`}
                    className="w-24 h-24 lg:w-32 lg:h-32 rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>
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
          <Tabs value={activeCategory || ''} className="w-full">
            {categories.map(category => (
              <TabsContent key={category.id} value={category.name}>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 uppercase">
                    {category.name}
                  </h2>

                  {isLoading ? (
                    <p className="text-gray-500">Loading products...</p>
                  ) : filteredProducts.length === 0 ? (
                    <p className="text-gray-500">No items found for "{searchQuery}"</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                      {filteredProducts.map((item) => (
                        <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="relative">
                            <img
                              src={item.images[0] || 'https://via.placeholder.com/300'}
                              alt={item.name}
                              className="w-full h-48 object-cover cursor-pointer"
                              onClick={() => handleViewImages(item.images)}
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
                            <div className="text-sm font-semibold text-gray-700 mb-3">
                              <select
                                value={selectedSizes[item.id] || ''}
                                onChange={(e) => handleSizeChange(item.id, e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                              >
                                <option value="" disabled>Select size</option>
                                {item.sizes.map((size) => (
                                  <option key={size} value={size}>{size}</option>
                                ))}
                              </select>
                            </div>

                            <Button
                              onClick={() => handleAddToCart(item, selectedSizes[item.id] || item.sizes[0])}
                              className="w-full bg-black hover:bg-gray-800 text-white rounded-full"
                              size="sm"
                              disabled={!selectedSizes[item.id] && item.sizes.length > 0}
                            >
                              <Plus className="w-4 h-4" /> Add to Cart
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {selectedProductImages && (
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
                  className="w-full h-auto max-h-[70vh] object-contain"
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
            </div>
          </div>
        )}
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