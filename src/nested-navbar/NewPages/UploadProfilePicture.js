


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Button } from '../../components/ui/button';
import { Upload, Pencil, Loader2 } from 'lucide-react';

const ProfilePictureUpload = ({ accountId, currentImage, onUploadSuccess }) => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
console.log("Current Image:", currentImage);
console.log("Preview Image:", preview);
  // Update preview when currentImage changes
  useEffect(() => {
    if (currentImage) {
      setPreview(`https://www.snptaxes.com/${currentImage}`);
    }
  }, [currentImage]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!image) {
      toast.warning('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('profilePicture', image);

    try {
      setIsUploading(true);
      await axios.patch(
        `https://www.snptaxes.com/api/accounts/${accountId}/profile-picture`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      toast.success('Profile picture updated successfully');
      if (onUploadSuccess) onUploadSuccess(); // <-- Call refetch
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setIsUploading(false);
      setImage(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <img
          src={preview || currentImage || '/default-avatar.png'}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-border"
          onError={(e) => { e.target.src = '/default-avatar.png'; }}
        />
        <input
          accept="image/*"
          className="hidden"
          id="profile-picture-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label
          htmlFor="profile-picture-upload"
          className="absolute bottom-0 right-0 bg-primary text-white rounded-lg p-1.5 cursor-pointer hover:bg-primary/90 transition-colors"
        >
          <Pencil size={14} />
        </label>
      </div>

      {image && (
        <>
          <p className="text-xs text-muted-foreground mt-1">
            {image.name} ({Math.round(image.size / 1024)} KB)
          </p>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full mt-2"
          >
            {isUploading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Upload Profile Picture
              </>
            )}
          </Button>
        </>
      )}
    </div>
  );
};

export default ProfilePictureUpload;
