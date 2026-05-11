'use client';
import { useState, useRef, useEffect } from 'react';
import { Save, Plus, Trash2, CheckCircle } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

export function ContactManager() {
  const socialMediaPlatforms = ['facebook', 'instagram', 'tiktok', 'whatsapp', 'youtube'] as const;

  const { contactInfo, setContactInfo } = useContent();
  const [formData, setFormData] = useState<{
    address: string;
    phone1: string;
    phone2: string;
    email1: string;
    email2: string;
    hours: string;
    socialMedia: Array<{ id: string; platform: string; url: string }>;
  }>({
    address: "",
    phone1: "",
    phone2: "",
    email1: "",
    email2: "",
    hours: "",
    socialMedia: [],
  });
  const [saved, setSaved] = useState(false);
  const loadedRef = useRef(false);

  // Load data once when contactInfo becomes available
  useEffect(() => {
    if (!loadedRef.current && contactInfo) {
      const normalized = Array.isArray(contactInfo.socialMedia)
        ? contactInfo.socialMedia.map((sm) => ({
            id: sm.id ?? Math.random().toString(36).substring(2, 11),
            platform: sm.platform ?? socialMediaPlatforms[0],
            url: sm.url ?? "",
          }))
        : [];

      setFormData({
        address: contactInfo.address || "",
        phone1: contactInfo.phone1 || "",
        phone2: contactInfo.phone2 || "",
        email1: contactInfo.email1 || "",
        email2: contactInfo.email2 || "",
        hours: contactInfo.hours || "",
        socialMedia: normalized,
      });

      loadedRef.current = true;
    }
  }, [contactInfo, socialMediaPlatforms]);

  const handleAddSocialMedia = () => {
    const newSocialMedia = {
      id: Math.random().toString(36).substring(2, 11),
      platform: socialMediaPlatforms[0],
      url: '',
    };
    setFormData({
      ...formData,
      socialMedia: [...formData.socialMedia, newSocialMedia],
    });
  };

  const handleRemoveSocialMedia = (id: string) => {
    setFormData({
      ...formData,
      socialMedia: formData.socialMedia.filter((sm) => sm.id !== id),
    });
  };

  const handleUpdateSocialMedia = (id: string, field: string, value: string) => {
    setFormData({
      ...formData,
      socialMedia: formData.socialMedia.map((sm) =>
        sm.id === id ? { ...sm, [field]: value } : sm
      ),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo(formData as any);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Update your business contact information</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Business Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
              placeholder="Full business address"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Phone Number 1 *
              </label>
              <input
                type="tel"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                placeholder="+62 812-3456-7890"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Phone Number 2
              </label>
              <input
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                placeholder="+62 821-9876-5432"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Email Address 1 *
              </label>
              <input
                type="email"
                value={formData.email1}
                onChange={(e) => setFormData({ ...formData, email1: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                placeholder="info@satriaclean.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Email Address 2
              </label>
              <input
                type="email"
                value={formData.email2}
                onChange={(e) => setFormData({ ...formData, email2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                placeholder="booking@satriaclean.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Operating Hours *
            </label>
            <textarea
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
              placeholder="Monday - Saturday: 08:00 - 18:00"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-[#1D1D1D]">Social Media Links</label>
              <button
                type="button"
                onClick={handleAddSocialMedia}
                className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-3 py-1 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Social Media
              </button>
            </div>

            <div className="space-y-4">
              {formData.socialMedia.map((socialMedia) => (
                <div key={socialMedia.id} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                      Platform
                    </label>
                    <select
                      value={socialMedia.platform}
                      onChange={(e) =>
                        handleUpdateSocialMedia(socialMedia.id, 'platform', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                    >
                      {socialMediaPlatforms.map((platform) => (
                        <option key={platform} value={platform}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-[#1D1D1D] mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      value={socialMedia.url}
                      onChange={(e) =>
                        handleUpdateSocialMedia(socialMedia.id, 'url', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-white dark:bg-white text-black dark:text-black"
                      placeholder="https://..."
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSocialMedia(socialMedia.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {formData.socialMedia.length === 0 && (
                <p className="text-gray-500 text-sm">No social media links added yet.</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-8 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>
            {saved && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-lg">
                <CheckCircle className="w-5 h-5" />
                Berhasil disimpan!
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="mt-8 bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-3xl">
        <h3 className="text-lg font-bold text-[#1D1D1D] mb-4">Preview</h3>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Address:</p>
            <p className="text-gray-600 whitespace-pre-line">{formData.address}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-700">Phone:</p>
              <p className="text-gray-600">{formData.phone1}</p>
              {formData.phone2 && <p className="text-gray-600">{formData.phone2}</p>}
            </div>
            <div>
              <p className="font-semibold text-gray-700">Email:</p>
              <p className="text-gray-600">{formData.email1}</p>
              {formData.email2 && <p className="text-gray-600">{formData.email2}</p>}
            </div>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Hours:</p>
            <p className="text-gray-600 whitespace-pre-line">{formData.hours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
