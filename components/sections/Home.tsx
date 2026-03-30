'use client';
import { BeforeAfterSlider } from './BeforeAfterSlider';
import { Droplet, Shield, Clock, Star, Award, Users } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export function Home() {
  const { services, testimonials } = useContent();

  const getServicePriceLabel = (service: (typeof services)[number]) => {
    const prices = Object.values(service.priceMatrix).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value),
    );

    if (prices.length === 0) {
      return 'Contact us';
    }

    const min = Math.min(...prices);
    const max = Math.max(...prices);

    if (min === max) {
      return `Rp ${min.toLocaleString('id-ID')}`;
    }

    return `Rp ${min.toLocaleString('id-ID')} - Rp ${max.toLocaleString('id-ID')}`;
  };

  const advantages = [
    {
      icon: <Droplet className="w-8 h-8" />,
      title: 'Eco-Friendly',
      description: 'Using environmentally safe cleaning products',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Paint Protection',
      description: 'Safe washing techniques that protect your vehicle',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Quick Service',
      description: 'Fast and efficient without compromising quality',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Professional Team',
      description: 'Experienced and certified cleaning specialists',
    },
  ];

  // Show only first 3 services on home page
  const featuredServices = services.slice(0, 3);

  return (
    <div>
      {/* Hero Section with Before/After Slider */}
      <section className="relative bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] text-white overflow-hidden">
        {/* Water Droplet Decorations */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-[#6797BF] rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-[#6797BF] rounded-full opacity-15 blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-[#6797BF] rounded-full opacity-10 blur-xl"></div>
        <div className="absolute bottom-40 right-1/3 w-32 h-32 bg-[#6797BF] rounded-full opacity-10 blur-2xl"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Transform Your Ride{' '}
                <span className="text-[#FCDE04]">From Dirty to Sparkling</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Professional car and motorcycle washing service in Ciomas. We bring your vehicle back to its pristine condition.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#FCDE04] text-[#1D1D1D] px-8 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors">
                  Book Now
                </button>
                <button className="border-2 border-[#6797BF] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6797BF] transition-colors">
                  Our Services
                </button>
              </div>
            </div>
            <div>
              <BeforeAfterSlider />
            </div>
          </div>
        </div>
        
        {/* Water Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#6797BF" fillOpacity="0.1"/>
          </svg>
        </div>
      </section>

      {/* Mini About */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Water Droplet Decorations */}
        <div className="absolute top-10 right-10 w-12 h-12 bg-[#6797BF] rounded-full opacity-10"></div>
        <div className="absolute bottom-10 left-10 w-8 h-8 bg-[#6797BF] rounded-full opacity-10"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-[#1D1D1D] mb-6">
              About <span className="text-[#FCDE04]">Satria</span> Car & Moto Clean
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">Located in the heart of Ciomas, Satria Car and Moto Clean has been serving the community with premium vehicle washing services. We combine professional expertise products to deliver exceptional results that exceed our customers' expectations.</p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#FCDE04]">
              <div className="w-16 h-16 bg-[#FCDE04] rounded-full flex items-center justify-center mb-4">
                <Star className="w-8 h-8 text-[#1D1D1D]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1D1D1D] mb-4">Our Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                To become the most trusted and preferred vehicle cleaning service in Ciomas and surrounding areas, known for our quality, reliability, and customer satisfaction.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-[#6797BF]">
              <div className="w-16 h-16 bg-[#6797BF] rounded-full flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#1D1D1D] mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To provide exceptional vehicle cleaning services using eco-friendly products, trained professionals, and innovative techniques while maintaining affordable prices for all customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Why Choose <span className="text-[#FCDE04]">Us</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-[#FCDE04] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <div className="text-[#1D1D1D]">{advantage.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">{advantage.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-[#1D1D1D] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Featured <span className="text-[#FCDE04]">Services</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <div
                key={index}
                className="bg-[#2D2D2D] p-8 rounded-xl hover:transform hover:scale-105 transition-all"
              >
                <h3 className="text-2xl font-bold text-[#FCDE04] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-300 mb-4">{service.description}</p>
                <p className="text-xl font-semibold text-[#6797BF]">
                  {getServicePriceLabel(service)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            What Our <span className="text-[#FCDE04]">Customers Say</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#FCDE04] text-[#FCDE04]"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-[#1D1D1D]">
                  {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FCDE04] to-[#e8cd04]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#1D1D1D] mb-4">
            Ready to Make Your Vehicle Shine?
          </h2>
          <p className="text-xl text-[#1D1D1D] mb-8">
            Visit us today and experience the difference!
          </p>
          <button className="bg-[#1D1D1D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D2D2D] transition-colors">
            Contact Us Now
          </button>
        </div>
      </section>
    </div>
  );
}