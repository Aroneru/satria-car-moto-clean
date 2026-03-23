'use client';
import { Droplet, Clock, Star, Check } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

export function Services() {
  const { services } = useContent();

  // Get price range for display
  const getPriceRange = (priceMatrix: any) => {
    const prices = [
      priceMatrix.small,
      priceMatrix.medium,
      priceMatrix.large,
      priceMatrix.extraLarge,
      priceMatrix.motorcycleStandard,
      priceMatrix.motorcycleMoge,
      priceMatrix.motorcycleExtraLarge,
    ].filter((p) => p !== undefined);

    if (prices.length === 0) return 'Contact for pricing';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    
    if (min === max) return `Rp ${min.toLocaleString()}`;
    return `Starting from Rp ${min.toLocaleString()}`;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] text-white py-20 relative overflow-hidden">
        {/* Water Droplet Decorations */}
        <div className="absolute top-10 left-20 w-20 h-20 bg-[#6797BF] rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-20 w-24 h-24 bg-[#6797BF] rounded-full opacity-15 blur-2xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Our <span className="text-[#FCDE04]">Services</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Comprehensive vehicle cleaning solutions tailored to your needs. From quick washes to complete detailing, we've got you covered.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-[#FCDE04] hover:shadow-xl transition-all"
              >
                <div className="w-20 h-20 bg-[#FCDE04] rounded-full flex items-center justify-center mb-4">
                  <div className="text-[#1D1D1D]">{service.icon}</div>
                </div>
                <h3 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-[#1D1D1D] mb-2">Features:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-[#6797BF] mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-bold text-[#6797BF]">{getPriceRange(service.priceMatrix)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-semibold text-gray-700">{service.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Why Choose <span className="text-[#FCDE04]">Satria Car & Moto Clean</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              'Professional Equipment',
              'Certified Technicians',
              'Quality Products',
              'Quick Service',
              'Affordable Pricing',
              'Customer Satisfaction',
              'Convenient Location',
              'Flexible Hours'
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-[#6797BF] rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-[#1D1D1D]">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Why Choose Our <span className="text-[#FCDE04]">Services</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Eco-Friendly Products',
                description: 'We use biodegradable, environmentally safe cleaning solutions.',
              },
              {
                title: 'Trained Professionals',
                description: 'Our team is certified and experienced in vehicle care.',
              },
              {
                title: 'Quality Guarantee',
                description: 'Not satisfied? We\'ll rewash your vehicle for free.',
              },
              {
                title: 'Affordable Pricing',
                description: 'Premium services at competitive prices for everyone.',
              },
            ].map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#FCDE04] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#1D1D1D]" />
                </div>
                <h3 className="text-xl font-bold text-[#1D1D1D] mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-[#FCDE04] to-[#e8cd04]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#1D1D1D] mb-4">
            Ready to Book a Service?
          </h2>
          <p className="text-xl text-[#1D1D1D] mb-8">
            Contact us today and give your vehicle the care it deserves!
          </p>
          <button className="bg-[#1D1D1D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D2D2D] transition-colors">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}