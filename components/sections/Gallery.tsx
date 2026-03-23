'use client';
import { useState } from 'react';
import { X, Play } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export function Gallery() {
  const { galleryImages } = useContent();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = ['All', 'Service', 'Detailing', 'Results', 'Team'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Our <span className="text-[#FCDE04]">Gallery</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our work through high-quality photos and videos showcasing our services, results, and team in action.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  activeCategory === category
                    ? 'bg-[#FCDE04] text-[#1D1D1D]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg aspect-square"
                onClick={() => setSelectedImage(image.url)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-lg">{image.title}</p>
                    <p className="text-[#FCDE04] text-sm">{image.category}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Watch Us <span className="text-[#FCDE04]">In Action</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Complete Wash Process',
                thumbnail: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjB3YXNoaW5nJTIwc2VydmljZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3Njk5OTU0NDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
              },
              {
                title: 'Detailing Showcase',
                thumbnail: 'https://images.unsplash.com/photo-1750563289663-a8abdd857ed5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXIlMjBkZXRhaWxpbmclMjBpbnRlcmlvcnxlbnwxfHx8fDE3NzAwMTY4MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
              },
            ].map((video, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-xl shadow-xl aspect-video"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-20 h-20 bg-[#FCDE04] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-[#1D1D1D] ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70">
                  <p className="text-white font-semibold text-lg">{video.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-16 bg-[#1D1D1D] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Before & <span className="text-[#FCDE04]">After</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                before: 'https://images.unsplash.com/photo-1560037062-1a8b1f7e0f7c?w=1080',
                after: 'https://images.unsplash.com/photo-1587350811385-f9bd58daf9e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaGlueSUyMGNsZWFuJTIwbHV4dXJ5JTIwY2FyfGVufDF8fHx8MTc3MDAxNjgwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
                title: 'SUV Detailing',
              },
              {
                before: 'https://images.unsplash.com/photo-1560037062-1a8b1f7e0f7c?w=1080',
                after: 'https://images.unsplash.com/photo-1762418916717-5a3327d76731?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwd2FzaGluZyUyMGNsZWFufGVufDF8fHx8MTc3MDAxNjgwMXww&ixlib=rb-4.1.0&q=80&w=1080',
                title: 'Motorcycle Restoration',
              },
            ].map((comparison, index) => (
              <div key={index} className="bg-[#2D2D2D] p-4 rounded-xl">
                <h3 className="text-xl font-bold text-[#FCDE04] mb-4">{comparison.title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Before</p>
                    <img
                      src={comparison.before}
                      alt="Before"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2">After</p>
                    <img
                      src={comparison.after}
                      alt="After"
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-[#FCDE04] transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}