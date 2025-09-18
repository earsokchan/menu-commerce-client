'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/sidebar';

interface Product {
  id: string;
  name: string;
  salePrice: number | null;
  riels: string;
  images: string[];
  badges: string[];
  quantity?: string;
  size?: string;
  color?: string;
  dateAdded?: string;
  category: string;
}

interface Category {
  id: string;
  name: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    salePrice: '',
    riels: '',
    images: ['', '', '', ''],
    badges: '',
    quantity: '',
    size: '',
    color: '',
    category: ''
  });
  const [newCategory, setNewCategory] = useState({ id: '', name: '' });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (category: string = 'all') => {
    setIsLoading(true);
    try {
      const url = category === 'all' 
        ? 'https://menu-commerce-backend-production.up.railway.app/api/products' 
        : `https://menu-commerce-backend-production.up.railway.app/api/products/category/${encodeURIComponent(category)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError('Error fetching products: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://menu-commerce-backend-production.up.railway.app/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      setError('Error fetching categories: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.riels || !newProduct.category) {
      setError('Please provide name, riels, and category');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        ...newProduct,
        salePrice: newProduct.salePrice ? parseFloat(newProduct.salePrice) : null,
        images: newProduct.images.filter(url => url !== ''),
        badges: newProduct.badges ? newProduct.badges.split(',').map(badge => badge.trim()) : [],
        quantity: newProduct.quantity || '',
        size: newProduct.size || '',
        color: newProduct.color || '',
        category: newProduct.category
      };

      const url = editingProductId ? `https://menu-commerce-backend-production.up.railway.app/api/products/${editingProductId}` : 'https://menu-commerce-backend-production.up.railway.app/api/products';
      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product');
      }

      await fetchProducts(categoryFilter);
      setNewProduct({
        id: '',
        name: '',
        salePrice: '',
        riels: '',
        images: ['', '', '', ''],
        badges: '',
        quantity: '',
        size: '',
        color: '',
        category: ''
      });
      setEditingProductId(null);
      setIsProductDialogOpen(false);
    } catch (err) {
      setError('Error saving product: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateCategory = async () => {
    if (!newCategory.name) {
      setError('Please provide category name');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = editingCategoryId ? `https://menu-commerce-backend-production.up.railway.app/api/categories/${editingCategoryId}` : 'https://menu-commerce-backend-production.up.railway.app/api/categories';
      const method = editingCategoryId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory.name })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save category');
      }

      await fetchCategories();
      setNewCategory({ id: '', name: '' });
      setEditingCategoryId(null);
      setIsCategoryDialogOpen(false);
    } catch (err) {
      setError('Error saving category: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://menu-commerce-backend-production.up.railway.app/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete product');
      }

      await fetchProducts(categoryFilter);
    } catch (err) {
      setError('Error deleting product: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://menu-commerce-backend-production.up.railway.app/api/categories/${encodeURIComponent(categoryName)}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete category');
      }

      await fetchCategories();
      if (categoryFilter === categoryName) {
        setCategoryFilter('all');
        await fetchProducts('all');
      }
    } catch (err) {
      setError('Error deleting category: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct({
      id: product.id,
      name: product.name,
      salePrice: product.salePrice ? product.salePrice.toString() : '',
      riels: product.riels,
      images: [
        product.images[0] || '',
        product.images[1] || '',
        product.images[2] || '',
        product.images[3] || ''
      ],
      badges: product.badges.join(', '),
      quantity: product.quantity || '',
      size: product.size || '',
      color: product.color || '',
      category: product.category || ''
    });
    setEditingProductId(product.id);
    setIsProductDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setNewCategory({ id: category.id, name: category.name });
    setEditingCategoryId(category.id);
    setIsCategoryDialogOpen(true);
  };

  const handleImageChange = (index: number, file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && typeof e.target.result === 'string') {
          const newImages = [...newProduct.images];
          newImages[index] = e.target.result;
          setNewProduct({ ...newProduct, images: newImages });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
    fetchProducts(value);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-1 sm:p-6 max-w-full">
        {/* Sticky mobile header */}
        <div className="md:hidden sticky top-0 z-20 bg-white shadow-sm flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-gray-800">Products</h1>
          <div className="flex gap-2">
            {/* Product Dialog */}
            <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
              setIsProductDialogOpen(open);
              if (!open) {
                setNewProduct({
                  id: '',
                  name: '',
                  salePrice: '',
                  riels: '',
                  images: ['', '', '', ''],
                  badges: '',
                  quantity: '',
                  size: '',
                  color: '',
                  category: ''
                });
                setEditingProductId(null);
                setError(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white px-3 py-2 rounded-full" size="icon" disabled={isLoading}>
                  +
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
                  {/* Responsive form fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="id" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">ID</label>
                    <Input
                      id="id"
                      value={newProduct.id}
                      onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="e.g., PROD003"
                      disabled={!!editingProductId || isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Name</label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="e.g., Product Name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="salePrice" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Sale Price</label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="e.g., 89.99 (optional)"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="riels" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Riels</label>
                    <Input
                      id="riels"
                      value={newProduct.riels}
                      onChange={(e) => setNewProduct({ ...newProduct, riels: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="e.g., 400,000"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Category</label>
                    <select
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="sm:col-span-3 p-2 border rounded-md bg-white text-gray-700"
                      disabled={isLoading}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Responsive Images row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[0, 1, 2, 3].map((index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center cursor-pointer group"
                        style={{ minWidth: 0 }}
                        onClick={() => {
                          const input = document.getElementById(`image-input-${index}`) as HTMLInputElement;
                          if (input) input.click();
                        }}
                      >
                        <label className="text-sm font-medium text-gray-700 mb-1 group-hover:text-blue-600">{`Image ${index + 1}`}</label>
                        {newProduct.images[index] ? (
                          <img
                            src={newProduct.images[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded mb-1 border group-hover:ring-2 group-hover:ring-blue-400 transition"
                          />
                        ) : (
                          <div className="w-24 h-24 sm:w-20 sm:h-20 bg-gray-200 rounded mb-1 flex items-center justify-center text-gray-400 text-xs border group-hover:ring-2 group-hover:ring-blue-400 transition">
                            No Image
                          </div>
                        )}
                        <input
                          id={`image-input-${index}`}
                          type="file"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            handleImageChange(index, file);
                          }}
                          disabled={isLoading}
                          tabIndex={-1}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="badges" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Badges</label>
                    <Input
                      id="badges"
                      value={newProduct.badges}
                      onChange={(e) => setNewProduct({ ...newProduct, badges: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="Comma-separated, e.g., New,Sale"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="quantity" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Quantity</label>
                    <Input
                      id="quantity"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="e.g., 100"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
                    <label htmlFor="color" className="text-sm font-medium text-gray-700 sm:text-right sm:col-span-1">Color</label>
                    <Input
                      id="color"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                      className="sm:col-span-3"
                      placeholder="e.g., Blue"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="text-gray-600 hover:text-gray-800" disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddOrUpdateProduct} 
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (editingProductId ? 'Update Product' : 'Save Product')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            {/* Category Dialog */}
            <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
              setIsCategoryDialogOpen(open);
              if (!open) {
                setNewCategory({ id: '', name: '' });
                setEditingCategoryId(null);
                setError(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white px-3 py-2 rounded-full" size="icon" disabled={isLoading}>
                  <span className="text-lg">≡</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <div className="grid gap-4 py-4 max-h-[80vh] overflow-y-auto">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="categoryName" className="text-right text-sm font-medium text-gray-700">Category Name</label>
                    <Input
                      id="categoryName"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Hoodies"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" className="text-gray-600 hover:text-gray-800" disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button 
                    onClick={handleAddOrUpdateCategory} 
                    className="bg-green-600 text-white hover:bg-green-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : (editingCategoryId ? 'Update Category' : 'Save Category')}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {/* ...existing error display... */}
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <div className="flex items-center gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => handleCategoryFilterChange(e.target.value)}
              className="w-[200px] p-2 border rounded-md bg-white text-gray-700"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Category Filter for mobile */}
        <div className="md:hidden mb-3 px-2">
          <select
            value={categoryFilter}
            onChange={(e) => handleCategoryFilterChange(e.target.value)}
            className="w-full p-2 border rounded-md bg-white text-gray-700"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        {/* Category List */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl md:text-base">Category List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading categories...</div>
            ) : (
              <>
                {/* Mobile: Cards, Desktop: Table */}
                <div className="md:hidden flex flex-col gap-2">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-white rounded shadow p-3 flex justify-between items-center">
                      <div>
                        <div className="font-semibold">{category.name}</div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600"
                          onClick={() => handleEditCategory(category)}
                          disabled={isLoading}
                        >Edit</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          disabled={isLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden md:block w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="min-w-[600px]">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700">Name</TableHead>
                          <TableHead className="text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categories.map((category) => (
                          <TableRow key={category.id} className="hover:bg-gray-50">
                            <TableCell>{category.name}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditCategory(category)}
                                disabled={isLoading}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                disabled={isLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        {/* Product List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl md:text-base">Product List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading products...</div>
            ) : (
              <>
                {/* Mobile: Cards, Desktop: Table */}
                <div className="md:hidden flex flex-col gap-3">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white rounded shadow p-3 flex flex-col gap-2">
                      <div className="flex gap-2 items-center">
                        <div className="flex gap-1">
                          {product.images.slice(0, 1).map((image, idx) => (
                            image ? (
                              <img key={idx} src={image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                            ) : (
                              <div key={idx} className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-400">No Image</div>
                            )
                          ))}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{product.name}</div>
                          <div className="text-xs text-gray-400">{product.category || '-'}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-blue-600"
                            onClick={() => handleEditProduct(product)}
                            disabled={isLoading}
                          >Edit</Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span>Sale: {product.salePrice ? `$${parseFloat(product.salePrice.toString()).toFixed(2)}` : '-'}</span>
                        <span>Riels: {product.riels}</span>
                        <span>Qty: {product.quantity || '-'}</span>
                        <span>Color: {product.color || '-'}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {product.badges.length > 0 ? (
                          product.badges.map((badge, idx) => (
                            <Badge key={idx} className="mr-1">{badge}</Badge>
                          ))
                        ) : (
                          <span className="text-xs text-gray-400">No badges</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden md:block w-full overflow-x-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  <div className="min-w-[1100px]">
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-gray-700">Product ID</TableHead>
                          <TableHead className="text-gray-700">Images</TableHead>
                          <TableHead className="text-gray-700">Name</TableHead>
                          <TableHead className="text-gray-700">Category</TableHead>
                          <TableHead className="text-gray-700">Sale Price</TableHead>
                          <TableHead className="text-gray-700">Riels</TableHead>
                          <TableHead className="text-gray-700">Badges</TableHead>
                          <TableHead className="text-gray-700">Quantity</TableHead>
                          <TableHead className="text-gray-700">Color</TableHead>
                          <TableHead className="text-gray-700">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.map((product) => (
                          <TableRow key={product.id} className="hover:bg-gray-50">
                            <TableCell>{product.id}</TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                {product.images.map((image, index) => (
                                  image && (
                                    <img 
                                      key={index}
                                      src={image} 
                                      alt={`${product.name} ${index + 1}`} 
                                      className="w-12 h-12 object-cover rounded"
                                    />
                                  )
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.category || '-'}</TableCell>
                            <TableCell>
                              {product.salePrice ? `$${parseFloat(product.salePrice.toString()).toFixed(2)}` : '-'}
                            </TableCell>
                            <TableCell>{product.riels}</TableCell>
                            <TableCell>
                              {product.badges.length > 0 ? (
                                product.badges.map((badge, index) => (
                                  <Badge key={index} className="mr-1">
                                    {badge}
                                  </Badge>
                                ))
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>{product.quantity || '-'}</TableCell>
                            <TableCell>{product.color || '-'}</TableCell>
                            <TableCell className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-blue-600 hover:text-blue-800"
                                onClick={() => handleEditProduct(product)}
                                disabled={isLoading}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-800"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={isLoading}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Responsive dialog: use Tailwind for width and padding */}
      <style jsx global>{`
        .dialog-content {
          width: 100% !important;
          max-width: 100vw !important;
          min-width: 0 !important;
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }
        @media (min-width: 640px) {
          .dialog-content {
            max-width: 425px !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
        @media (max-width: 639px) {
          .dialog-content {
            min-height: 100vh !important;
            border-radius: 0 !important;
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
        }
        /* Optional: Custom scrollbar for better UX */
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background: #d1d5db;
        }
        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        .scrollbar-thin::-webkit-scrollbar {
          height: 8px;
        }
      `}</style>
    </div>
  );
}