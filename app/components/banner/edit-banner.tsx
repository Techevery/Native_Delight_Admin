import React, { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pencil } from 'lucide-react';
import { updateBannerData } from '@/lib/api';
import { toast } from 'react-toastify';

interface Banner {
  _id: string;
  name: string;
  image: {url: string};
}

interface EditBannerModalProps {
  banner: Banner;
  onUpdate: (updatedBanner: Banner) => void;
}

const EditBannerModal: React.FC<EditBannerModalProps> = ({ banner, onUpdate }) => {
  const [editedName, setEditedName] = useState(banner.name);
  const [editedImage, setEditedImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    if (!editedName.trim()) {
      setError('Banner name is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', editedName);
      if (editedImage) {
        formData.append('image', editedImage);
      }

      const response = await updateBannerData(banner._id, formData);
      onUpdate(response);
      toast.success('Banner updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      setError(null);
    } catch (error: any) {
      console.error('Error updating banner:', error);
      setError(error.response?.data?.message || 'Failed to update banner');
      toast.error('Unable to update banner!', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Banner</AlertDialogTitle>
          <AlertDialogDescription>
            Update the name and optionally upload a new image for the banner.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          placeholder="Banner name"
          className="mt-4"
        />
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setEditedImage(e.target.files?.[0] || null)}
          className="mt-4"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setError(null)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleUpdate}>
            Update
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditBannerModal;