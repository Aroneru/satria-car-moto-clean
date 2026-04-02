'use client';
import { useState } from 'react';
import { Save, Plus, Trash2, Link } from 'lucide-react';
import { useContent } from '@/context/ContentContext';

type Platform = "facebook" | "instagram" | "tiktok" | "youtube" | "whatsapp";

const PLATFORM_CONFIG: Record<Platform, {
  label: string;
  placeholder: string;
  img?: string;
  fallbackIcon?: React.ReactNode;
}> = {
  facebook: {
    label: 'Facebook',
    placeholder: 'https://facebook.com/satriaclean',
    img: '/images/facebook.png',
  },
  instagram: {
    label: 'Instagram',
    placeholder: 'https://instagram.com/satriaclean',
    img: '/images/instagram.png',
  },
  tiktok: {
    label: 'TikTok',
    placeholder: 'https://tiktok.com/@satriaclean',
    img: '/images/tiktok.png',
  },
  youtube: {
    label: 'YouTube',
    placeholder: 'https://youtube.com/@satriaclean',
    img: '/images/youtube.png',
  },
  whatsapp: {
    label: 'WhatsApp',
    placeholder: 'https://wa.me/6281234567890',
    img: '/images/whatsapp.png',
  },
};

const ALL_PLATFORMS = Object.keys(PLATFORM_CONFIG) as Platform[];

export function ContactManager() {
  const { contactInfo, setContactInfo } = useContent();
  const [formData, setFormData] = useState(contactInfo);
  const [saved, setSaved] = useState(false);

  // Social media add form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPlatform, setNewPlatform] = useState<Platform>('facebook');
  const [newUrl, setNewUrl] = useState('');
  const [urlError, setUrlError] = useState('');

  const usedPlatforms = formData.socialLinks.map((s) => s.platform);
  const availablePlatforms = ALL_PLATFORMS.filter((p) => !usedPlatforms.includes(p));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactInfo(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAddSocial = () => {
    if (!newUrl.trim()) {
      setUrlError('URL tidak boleh kosong');
      return;
    }
    try {
      new URL(newUrl.trim());
    } catch {
      setUrlError('Format URL tidak valid (contoh: https://...)');
      return;
    }
    setUrlError('');
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: newPlatform, url: newUrl.trim() },
      ],
    }));
    setNewUrl('');
    setShowAddForm(false);
    // Auto-pick next available platform
    const nextAvail = ALL_PLATFORMS.find(
      (p) => p !== newPlatform && !usedPlatforms.includes(p)
    );
    if (nextAvail) setNewPlatform(nextAvail);
  };

  const handleRemoveSocial = (platform: Platform) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((s) => s.platform !== platform),
    }));
  };

  const handleEditSocialUrl = (platform: Platform, url: string) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((s) =>
        s.platform === platform ? { ...s, url } : s
      ),
    }));
  };

  // When opening add form, default to first available platform
  const handleOpenAddForm = () => {
    const first = availablePlatforms[0];
    if (first) setNewPlatform(first);
    setNewUrl('');
    setUrlError('');
    setShowAddForm(true);
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-600">Update informasi kontak dan social media bisnis Anda</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Alamat Bisnis *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
              placeholder="Alamat lengkap bisnis"
            />
          </div>

          {/* Phone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Nomor Telepon 1 *
              </label>
              <input
                type="tel"
                value={formData.phone1}
                onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
                placeholder="+62 812-3456-7890"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Nomor Telepon 2
              </label>
              <input
                type="tel"
                value={formData.phone2}
                onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
                placeholder="+62 821-9876-5432"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Email 1 *
              </label>
              <input
                type="email"
                value={formData.email1}
                onChange={(e) => setFormData({ ...formData, email1: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
                placeholder="info@satriaclean.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                Email 2
              </label>
              <input
                type="email"
                value={formData.email2}
                onChange={(e) => setFormData({ ...formData, email2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
                placeholder="booking@satriaclean.com"
              />
            </div>
          </div>

          {/* Hours */}
          <div>
            <label className="block text-sm font-semibold text-[#1D1D1D] mb-2">
              Jam Operasional *
            </label>
            <textarea
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
              placeholder="Monday - Saturday: 08:00 - 18:00"
            />
          </div>

          {/* ─── Social Media Manager ─── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-[#1D1D1D]">
                Social Media
              </label>
              {availablePlatforms.length > 0 && (
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="flex items-center gap-1.5 text-sm bg-[#FCDE04] text-[#1D1D1D] px-3 py-1.5 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Tambah URL
                </button>
              )}
            </div>

            {/* Add Social Form */}
            {showAddForm && (
              <div className="mb-4 p-4 bg-[#FCDE04]/10 border-2 border-[#FCDE04] rounded-xl space-y-3">
                <p className="text-sm font-semibold text-[#1D1D1D]">Tambah Social Media Baru</p>

                {/* Platform picker */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">Pilih Platform</label>
                  <div className="flex flex-wrap gap-2">
                    {availablePlatforms.map((p) => {
                      const cfg = PLATFORM_CONFIG[p];
                      const selected = newPlatform === p;
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setNewPlatform(p)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                            selected
                              ? 'border-[#FCDE04] bg-[#FCDE04]/10 text-[#1D1D1D]'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          <span className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-white border border-[#FCDE04]">
                            {cfg.img ? (
                              <img src={cfg.img} alt={cfg.label} className="w-4 h-4 object-contain" />
                            ) : (
                              cfg.fallbackIcon
                            )}
                          </span>
                          {cfg.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* URL input */}
                <div>
                  <label className="block text-xs text-gray-500 mb-1.5">
                    URL {PLATFORM_CONFIG[newPlatform]?.label}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Link className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type="url"
                        value={newUrl}
                        onChange={(e) => { setNewUrl(e.target.value); setUrlError(''); }}
                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black ${
                          urlError ? 'border-red-400' : 'border-gray-300'
                        }`}
                        placeholder={PLATFORM_CONFIG[newPlatform]?.placeholder}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSocial())}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSocial}
                      className="px-4 py-2 bg-[#1D1D1D] text-white rounded-lg text-sm font-semibold hover:bg-[#333] transition-colors whitespace-nowrap"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                  {urlError && (
                    <p className="text-xs text-red-500 mt-1">{urlError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Social Links List */}
            {formData.socialLinks.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 text-sm">
                <p>Belum ada social media yang ditambahkan.</p>
                <p>Klik <span className="font-semibold text-[#1D1D1D]">+ Tambah URL</span> untuk memulai.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {formData.socialLinks.map((social) => {
                  const cfg = PLATFORM_CONFIG[social.platform];
                  if (!cfg) return null;
                  return (
                    <div
                      key={social.platform}
                      className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl group hover:border-gray-300 transition-colors"
                    >
                      {/* Platform icon */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 bg-white border-2 border-[#FCDE04]">
                        {cfg.img ? (
                          <img src={cfg.img} alt={cfg.label} className="w-5 h-5 object-contain" />
                        ) : (
                          cfg.fallbackIcon
                        )}
                      </div>

                      {/* Platform label */}
                      <span className="text-sm font-semibold text-[#1D1D1D] w-24 flex-shrink-0">
                        {cfg.label}
                      </span>

                      {/* URL input (editable inline) */}
                      <input
                        type="url"
                        value={social.url}
                        onChange={(e) => handleEditSocialUrl(social.platform, e.target.value)}
                        className="flex-1 text-sm px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black min-w-0"
                        placeholder={cfg.placeholder}
                      />

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveSocial(social.platform)}
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={`Hapus ${cfg.label}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Preview icons */}
            {formData.socialLinks.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Preview di website:</p>
                <div className="flex gap-2 flex-wrap">
                  {formData.socialLinks
                    .filter((s) => s.url.trim() !== '')
                    .map((s) => {
                      const cfg = PLATFORM_CONFIG[s.platform];
                      if (!cfg) return null;
                      return (
                        <div
                          key={s.platform}
                          className="w-9 h-9 rounded-full flex items-center justify-center bg-white border-2 border-[#FCDE04] shadow-sm"
                          title={cfg.label}
                        >
                          {cfg.img ? (
                            <img src={cfg.img} alt={cfg.label} className="w-5 h-5 object-contain" />
                          ) : (
                            cfg.fallbackIcon
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#FCDE04] text-[#1D1D1D] px-8 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors"
            >
              <Save className="w-5 h-5" />
              Simpan Perubahan
            </button>
            {saved && (
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                ✓ Tersimpan!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
