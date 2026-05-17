'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Loader } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { useToast } from '@/context/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function GalleryManager() {
  const { galleryImages, setGalleryImages, isLoading } = useContent();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Service',
  });

  const resetForm = () => {
    setFormData({ title: '', category: 'Service' });
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadError(null);
    setIsEditing(false);
    setEditingImage(null);
  };

  // Handle escape key to close form
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isEditing) {
        resetForm();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isEditing]);

  const categories = ['Service', 'Detailing', 'Results', 'Team'];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null);
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEdit = (image: any) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      category: image.category,
    });
    setPreviewUrl(image.url);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setGalleryImages(galleryImages.filter((img) => img.id !== deleteTarget));
    setDeleteTarget(null);
    addToast('success', 'Gambar berhasil dihapus!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setIsUploading(true);

    try {
      let imageUrl = previewUrl;

      // If editing, previewUrl is the old URL; only upload if file changed
      // If new, we must have a file
      if (!editingImage && !selectedFile) {
        setUploadError('Please select an image file');
        setIsUploading(false);
        return;
      }

      // Upload new file if selected (for new or edited images)
      if (selectedFile) {
        const supabase = createClient();
        const fileName = `${Date.now()}-${selectedFile.name}`;

        const { data, error } = await supabase.storage
          .from('gallery')
          .upload(fileName, selectedFile);

        if (error) {
          throw new Error(error.message);
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(data.path);

        imageUrl = publicUrlData.publicUrl;
      }

      const imageData = {
        id: editingImage?.id || crypto.randomUUID(),
        url: imageUrl,
        title: formData.title,
        category: formData.category,
      };

      if (editingImage) {
        setGalleryImages(galleryImages.map((img) => (img.id === editingImage.id ? imageData : img)));
        addToast('success', 'Gambar berhasil diperbarui!');
      } else {
        setGalleryImages([...galleryImages, imageData]);
        addToast('success', 'Gambar baru berhasil ditambahkan!');
      }

      resetForm();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <DeleteConfirmDialog
        open={deleteTarget !== null}
        title="Delete Image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        confirmLabel="Delete Image"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Manage gallery images</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-4 py-2 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Image
        </button>
      </div>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <Skeleton className="w-full h-48" />
              <div className="p-4 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {galleryImages.map((image) => (
          <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="aspect-square relative group">
              <img src={image.url} alt={image.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleEdit(image)}
                  className="p-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-3 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-[#1D1D1D] mb-1">{image.title}</h3>
              <span className="inline-block px-3 py-1 bg-[#6797BF] text-white text-xs rounded-full">
                {image.category}
              </span>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Edit/Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#1D1D1D]">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Image File *
                </label>
                <label className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FCDE04] transition-colors flex items-center justify-center gap-2 bg-gray-50">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-600">
                    {selectedFile ? selectedFile.name : 'Click to select image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                {!editingImage && !selectedFile && (
                  <p className="text-sm text-red-600 mt-1">Image file required</p>
                )}
              </div>

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {uploadError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Image Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  disabled={isUploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="e.g., Professional Car Washing"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  disabled={isUploading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {previewUrl && (
                <div>
                  <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                    Preview
                  </label>
                  <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Invalid+URL';
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    editingImage ? 'Update Image' : 'Upload Image'
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isUploading}
                  className="px-6 py-3 border-2 border-red-300 text-red-700 bg-red-50 rounded-lg font-semibold hover:bg-red-100 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
