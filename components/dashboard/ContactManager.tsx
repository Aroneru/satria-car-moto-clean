'use client';
import { useState } from 'react';
import { Save } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export function ContactManager() {
  const { contactInfo, setContactInfo } = useContent();
  const [formData, setFormData] = useState(contactInfo);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
              placeholder="Monday - Saturday: 08:00 - 18:00"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
                placeholder="https://facebook.com/satriaclean"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
                placeholder="https://instagram.com/satriaclean"
              />
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
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                ✓ Saved successfully!
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
