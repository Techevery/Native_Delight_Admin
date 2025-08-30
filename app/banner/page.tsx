"use client";
import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2 } from 'lucide-react';
import { fetchBanners, addBannerData, deleteBannerData } from '@/lib/api';
import { toast } from 'react-toastify';
import EditBannerModal from '../components/banner/edit-banner';

interface Banner {
  _id: string;
  name: string;
  image: {url: string};
}

const Banner = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [newBannerName, setNewBannerName] = useState('');
  const [newBannerImage, setNewBannerImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBannersData = async () => {
      try {
        const response = await fetchBanners();
        setBanners(response);
      } catch (error) {
        console.error('Error fetching banners:', error);
        setError('Failed to fetch banners');
      }
    };
    fetchBannersData();
  }, []);

  const handleAddBanner = async () => {
    if (!newBannerName.trim() || !newBannerImage) {
      setError('Banner name and image file are required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newBannerName);
      formData.append('image', newBannerImage);

      const response = await addBannerData(formData);
      setBanners([...banners, response]);
      toast.success('Banner added successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setNewBannerName('');
      setNewBannerImage(null);
      setError(null);
    } catch (error: any) {
      console.error('Error saving banner:', error);
      setError(error.response?.data?.message || 'Failed to save banner');
      toast.error('Unable to add banner!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleUpdateBanner = (updatedBanner: Banner) => {
    setBanners(
      banners.map((banner) =>
        banner._id === updatedBanner._id ? updatedBanner : banner
      )
    );
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBannerData(id);
      setBanners(banners.filter((banner) => banner._id !== id));
      toast.success('Banner deleted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
  setError(null);
    } catch (error: any) {
      console.error('Error deleting banner:', error);
      setError(error.response?.data?.message || 'Failed to delete banner');
      toast.error('Unable to delete banner!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <AppLayout>
      <div className="m-0 p-0">
        <header className="flex justify-end mb-6 mx-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button>Add Banner Data</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Banner</AlertDialogTitle>
                <AlertDialogDescription>
                  Enter the name and select an image file for the banner below.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Input
                value={newBannerName}
                onChange={(e) => setNewBannerName(e.target.value)}
                placeholder="Banner name"
                className="mt-4"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setNewBannerImage(e.target.files?.[0] || null)}
                className="mt-4"
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setError(null)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleAddBanner}>
                  Add
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </header>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No banners found
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>{banner.name}</TableCell>
                  <TableCell>
                    <img src={banner.image?.url} alt={banner.name} className="h-10 w-auto object-cover" />
                  </TableCell>
                  <TableCell className="text-right">
                    <EditBannerModal
                      banner={banner}
                      onUpdate={handleUpdateBanner}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(banner._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
};

export default Banner;