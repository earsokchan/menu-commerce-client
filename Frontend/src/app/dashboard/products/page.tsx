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
  originalPrice: number;
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
    originalPrice: '',
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
        ? 'https://api-404found-v1.vercel.app/api/products' 
        : `https://api-404found-v1.vercel.app/api/products/category/${encodeURIComponent(category)}`;
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
      const response = await fetch('https://api-404found-v1.vercel.app/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data); // Directly set the categories from the API response
    } catch (err) {
      setError('Error fetching categories: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddOrUpdateProduct = async () => {
    if (!newProduct.name || !newProduct.originalPrice || !newProduct.riels || !newProduct.category) {
      setError('Please provide name, original price, riels, and category');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const productData = {
        ...newProduct,
        originalPrice: parseFloat(newProduct.originalPrice),
        salePrice: newProduct.salePrice ? parseFloat(newProduct.salePrice) : null,
        images: newProduct.images.filter(url => url !== ''),
        badges: newProduct.badges ? newProduct.badges.split(',').map(badge => badge.trim()) : [],
        quantity: newProduct.quantity || '',
        size: newProduct.size || '',
        color: newProduct.color || '',
        category: newProduct.category
      };

      const url = editingProductId ? `https://api-404found-v1.vercel.app/api/products/${editingProductId}` : 'https://api-404found-v1.vercel.app/api/products';
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
        originalPrice: '',
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
      const url = editingCategoryId ? `http://localhost:5000/api/categories/${editingCategoryId}` : 'http://localhost:5000/api/categories';
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
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
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
      const response = await fetch(`http://localhost:5000/api/categories/${encodeURIComponent(categoryName)}`, {
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
      originalPrice: product.originalPrice.toString(),
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
      <div className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <div className="flex justify-between items-center mb-6">
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
            <Dialog open={isProductDialogOpen} onOpenChange={(open) => {
              setIsProductDialogOpen(open);
              if (!open) {
                setNewProduct({
                  id: '',
                  name: '',
                  originalPrice: '',
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
                <Button className="bg-blue-600 text-white hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Add Product'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>{editingProductId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="id" className="text-right text-sm font-medium text-gray-700">ID</label>
                    <Input
                      id="id"
                      value={newProduct.id}
                      onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., PROD003"
                      disabled={!!editingProductId || isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right text-sm font-medium text-gray-700">Name</label>
                    <Input
                      id="name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., Product Name"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="originalPrice" className="text-right text-sm font-medium text-gray-700">Original Price</label>
                    <Input
                      id="originalPrice"
                      type="number"
                      value={newProduct.originalPrice}
                      onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 99.99"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="salePrice" className="text-right text-sm font-medium text-gray-700">Sale Price</label>
                    <Input
                      id="salePrice"
                      type="number"
                      value={newProduct.salePrice}
                      onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 89.99 (optional)"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="riels" className="text-right text-sm font-medium text-gray-700">Riels</label>
                    <Input
                      id="riels"
                      value={newProduct.riels}
                      onChange={(e) => setNewProduct({ ...newProduct, riels: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 400,000"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="category" className="text-right text-sm font-medium text-gray-700">Category</label>
                    <select
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="col-span-3 p-2 border rounded-md bg-white text-gray-700"
                      disabled={isLoading}
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.name}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  {[1, 2, 3, 4].map((num, index) => (
                    <div key={num} className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor={`image${num}`} className="text-right text-sm font-medium text-gray-700">{`Image ${num}`}</label>
                      <Input
                        id={`image${num}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          handleImageChange(index, file);
                        }}
                        className="col-span-3"
                        disabled={isLoading}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="badges" className="text-right text-sm font-medium text-gray-700">Badges</label>
                    <Input
                      id="badges"
                      value={newProduct.badges}
                      onChange={(e) => setNewProduct({ ...newProduct, badges: e.target.value })}
                      className="col-span-3"
                      placeholder="Comma-separated, e.g., New,Sale"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="quantity" className="text-right text-sm font-medium text-gray-700">Quantity</label>
                    <Input
                      id="quantity"
                      value={newProduct.quantity}
                      onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., 100"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="size" className="text-right text-sm font-medium text-gray-700">Size</label>
                    <Input
                      id="size"
                      value={newProduct.size}
                      onChange={(e) => setNewProduct({ ...newProduct, size: e.target.value })}
                      className="col-span-3"
                      placeholder="e.g., M"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="color" className="text-right text-sm font-medium text-gray-700">Color</label>
                    <Input
                      id="color"
                      value={newProduct.color}
                      onChange={(e) => setNewProduct({ ...newProduct, color: e.target.value })}
                      className="col-span-3"
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
            <Dialog open={isCategoryDialogOpen} onOpenChange={(open) => {
              setIsCategoryDialogOpen(open);
              if (!open) {
                setNewCategory({ id: '', name: '' });
                setEditingCategoryId(null);
                setError(null);
              }
            }}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 text-white hover:bg-green-700" disabled={isLoading}>
                  {isLoading ? 'Loading...' : 'Manage Categories'}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogTitle>{editingCategoryId ? 'Edit Category' : 'Add New Category'}</DialogTitle>
                <div className="grid gap-4 py-4">
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
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Category List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading categories...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Category ID</TableHead>
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id} className="hover:bg-gray-50">
                      <TableCell>{category.id}</TableCell>
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
            )}
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Product List</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div>Loading products...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Product ID</TableHead>
                    <TableHead className="text-gray-700">Images</TableHead>
                    <TableHead className="text-gray-700">Name</TableHead>
                    <TableHead className="text-gray-700">Category</TableHead>
                    <TableHead className="text-gray-700">Original Price</TableHead>
                    <TableHead className="text-gray-700">Sale Price</TableHead>
                    <TableHead className="text-gray-700">Riels</TableHead>
                    <TableHead className="text-gray-700">Badges</TableHead>
                    <TableHead className="text-gray-700">Quantity</TableHead>
                    <TableHead className="text-gray-700">Size</TableHead>
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
                      <TableCell>${parseFloat(product.originalPrice.toString()).toFixed(2)}</TableCell>
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
                      <TableCell>{product.size || '-'}</TableCell>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}