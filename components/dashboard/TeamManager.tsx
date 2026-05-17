'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, User, Upload } from 'lucide-react';
import { useContent } from '@/context/ContentContext';
import { useToast } from '@/context/ToastContext';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageWithFallback } from '../sections/figma/ImageWithFallback';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';

export function TeamManager() {
  const { teamMembers, setTeamMembers, isLoading } = useContent();
  const { addToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    description: '',
    photo: '',
  });

  const resetForm = () => {
    setFormData({ name: '', role: '', description: '', photo: '' });
    setIsEditing(false);
    setEditingMember(null);
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

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      description: member.description,
      photo: member.photo || '',
    });
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    setDeleteTarget(id);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setTeamMembers(teamMembers.filter((m) => m.id !== deleteTarget));
    setDeleteTarget(null);
    addToast('success', 'Anggota tim berhasil dihapus!');
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|jpeg|jpg)$/)) {
      alert('Please upload only PNG or JPG images');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, photo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const memberData = {
      id: editingMember?.id || crypto.randomUUID(),
      name: formData.name,
      role: formData.role,
      description: formData.description,
      photo: formData.photo,
    };

    if (editingMember) {
      setTeamMembers(teamMembers.map((m) => (m.id === editingMember.id ? memberData : m)));
      addToast('success', 'Anggota tim berhasil diperbarui!');
    } else {
      setTeamMembers([...teamMembers, memberData]);
      addToast('success', 'Anggota tim baru berhasil ditambahkan!');
    }

    resetForm();
  };

  return (
    <div>
      <DeleteConfirmDialog
        open={deleteTarget !== null}
        title="Delete Team Member"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmLabel="Delete Team Member"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600">Manage team members</p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-4 py-2 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Team Member
        </button>
      </div>

      {/* Team Grid */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
              <Skeleton className="w-20 h-20 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-20 mx-auto mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center">
            {member.photo ? (
              <ImageWithFallback
                src={member.photo}
                alt={member.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-[#6797BF] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                {member.name.charAt(0)}
              </div>
            )}
            <h3 className="text-lg font-bold text-[#1D1D1D] mb-1">{member.name}</h3>
            <p className="text-[#6797BF] font-semibold text-sm mb-2">{member.role}</p>
            <p className="text-gray-600 text-sm mb-4">{member.description}</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => handleEdit(member)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(member.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
                {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
              </h3>
              <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                  placeholder="e.g., Satria Wijaya"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Role/Position *
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                  placeholder="e.g., Founder & CEO"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                  placeholder="Brief description or expertise"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                  Profile Photo (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Upload PNG or JPG image (max 5MB)
                </p>
                <div className="space-y-3">
                  {/* File Upload Button */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FCDE04] hover:bg-gray-50 transition-colors">
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          Choose Photo
                        </span>
                      </div>
                      <input
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {formData.photo && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, photo: '' })}
                        className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Preview */}
                  {formData.photo ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <img
                        src={formData.photo}
                        alt={formData.name || 'Preview'}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Photo Uploaded</p>
                        <p className="text-xs text-gray-500">Photo will be displayed as profile picture</p>
                      </div>
                      <div className="text-green-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  ) : formData.name ? (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="w-16 h-16 bg-[#6797BF] rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {formData.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">Fallback Avatar</p>
                        <p className="text-xs text-gray-500">Initial letter will be shown if no photo uploaded</p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
                >
                  {editingMember ? 'Update Member' : 'Add Member'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-red-300 text-red-700 bg-red-50 rounded-lg font-semibold hover:bg-red-100 transition-colors"
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