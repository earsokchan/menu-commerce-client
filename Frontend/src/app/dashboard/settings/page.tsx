'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Sidebar from '@/components/sidebar';

interface Banner {
  id: string;
  percentage: string;
  title: string;
  description: string;
  images: string[];
}

export default function Settings() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [percentage, setPercentage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch existing banner on mount
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/discount-banner');
        if (!response.ok) throw new Error('Failed to fetch discount banner');
        const data = await response.json();
        if (data) {
          setBanner(data);
          setPercentage(data.percentage);
          setTitle(data.title);
          setDescription(data.description);
        }
      } catch (err) {
        setError('Error fetching discount banner: ' + (err as Error).message);
      }
    };
    
    fetchBanner();
  }, []);

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  // Convert files to base64 for API submission
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // Convert images to base64
      const base64Images = await Promise.all(images.map(file => convertToBase64(file)));
      
      const bannerData = {
        percentage,
        title,
        description,
        images: base64Images,
      };

      const endpoint = banner ? `/api/discount-banner/${banner.id}` : '/api/discount-banner';
      const method = banner ? 'PUT' : 'POST';

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save banner');
      }

      const result = await response.json();
      setBanner(result.banner);
      setSuccess(`Discount banner ${banner ? 'updated' : 'added'} successfully!`);
      
      // Reset images if creating new banner
      if (!banner) {
        setImages([]);
        setPercentage('');
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      setError('Error saving discount banner: ' + (err as Error).message);
    }
  };

  // Handle banner deletion
  const handleDelete = async () => {
    if (!banner) return;

    try {
      const response = await fetch(`http://localhost:5000/api/discount-banner/${banner.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete banner');
      }

      setBanner(null);
      setPercentage('');
      setTitle('');
      setDescription('');
      setImages([]);
      setSuccess('Discount banner deleted successfully!');
    } catch (err) {
      setError('Error deleting discount banner: ' + (err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Settings</h1>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Discount Banner Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="percentage" className="block text-sm font-medium text-gray-700">
                  Discount Percentage
                </label>
                <Input
                  id="percentage"
                  placeholder="Enter discount percentage (e.g., 15)"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Banner Title
                </label>
                <Input
                  id="title"
                  placeholder="Enter banner title (e.g., DISCOUNT)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Banner Description
                </label>
                <Input
                  id="description"
                  placeholder="Enter banner description (e.g., CLOTHING & ACCESSORIES)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                  Banner Images
                </label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mt-1"
                />
                {banner?.images && banner.images.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {banner.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Banner image ${index + 1}`}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {banner ? 'Update Banner' : 'Add Banner'}
                </Button>
                {banner && (
                  <Button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Banner
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}