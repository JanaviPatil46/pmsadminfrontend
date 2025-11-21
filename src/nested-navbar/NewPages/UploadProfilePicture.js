


import React, { useState, useEffect } from 'react';
import { 
  Avatar,
  Button,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { toast } from 'react-toastify';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Box sx={{ position: 'relative' }}>
        <Avatar
          src={preview || currentImage}
          sx={{ width: 120, height: 120, border: '2px solid #eee' }}
        />
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="profile-picture-upload"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="profile-picture-upload">
          <Box
            component="span"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              borderRadius: '10px',
              cursor: 'pointer',
              padding: '6px 8px',
              backgroundColor: 'primary.main',
              '&:hover': { backgroundColor: 'primary.dark' },
            }}
          >
            <EditIcon sx={{ color: 'white' }} fontSize="small" />
          </Box>
        </label>
      </Box>

      {image && (
        <>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {image.name} ({Math.round(image.size / 1024)} KB)
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={isUploading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isUploading ? (
              <>
                <CircularProgress size={24} color="inherit" />
                <Box sx={{ ml: 1 }}>Uploading...</Box>
              </>
            ) : (
              'Upload Profile Picture'
            )}
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProfilePictureUpload;
