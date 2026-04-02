'use client';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export function GalleryManager() {
  const { galleryImages, setGalleryImages } = useContent();
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<any>(null);

  const [formData, setFormData] = useState({
    url: '',
    title: '',
    category: 'Service',
  });

  const categories = ['Service', 'Detailing', 'Results', 'Team'];

  const handleEdit = (image: any) => {
    setEditingImage(image);
    setFormData({
      url: image.url,
      title: image.title,
      category: image.category,
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      setGalleryImages(galleryImages.filter((img) => img.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const imageData = {
      id: editingImage?.id || crypto.randomUUID(),
      url: formData.url,
      title: formData.title,
      category: formData.category,
    };

    if (editingImage) {
      setGalleryImages(galleryImages.map((img) => (img.id === editingImage.id ? imageData : img)));
    } else {
      setGalleryImages([...galleryImages, imageData]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({ url: '', title: '', category: 'Service' });
    setIsEditing(false);
    setEditingImage(null);
  };

  return (
    <div>
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
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Image Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black autofill:bg-gray-200 autofill:text-black"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {formData.url && (
                <div>
                  <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                    Preview
                  </label>
                  <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.url}
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
                  className="flex-1 bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
                >
                  {editingImage ? 'Update Image' : 'Add Image'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
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
