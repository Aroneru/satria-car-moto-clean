'use client';
import { CheckCircle, Target, Users, Award } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function About() {
  const { teamMembers } = useContent();

  const milestones = [
    { year: '2018', event: 'Satria Car & Moto Clean established in Ciomas' },
    { year: '2019', event: 'Expanded services to include motorcycle washing' },
    { year: '2020', event: 'Introduced eco-friendly cleaning products' },
    { year: '2022', event: 'Opened second location and hired 10+ staff' },
    { year: '2024', event: 'Served over 10,000 satisfied customers' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            About <span className="text-[#FCDE04]">Satria</span> Car & Moto Clean
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted partner in vehicle care, dedicated to excellence and customer satisfaction since 2018.
          </p>
        </div>
      </section>

      {/* Company Identity */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-[#1D1D1D] mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-700">
              <p className="mb-4">
                Satria Car and Moto Clean was born from a passion for automotive excellence and a commitment to providing the community of Ciomas with professional vehicle cleaning services. What started as a small operation has grown into one of the most trusted names in vehicle care in the region.
              </p>
              <p className="mb-4">
                We understand that your vehicle is more than just a mode of transportation—it's an investment, a reflection of your personality, and often a source of pride. That's why we treat every car and motorcycle that comes through our doors with the utmost care and attention to detail.
              </p>
              <p>
                Our commitment to using eco-friendly products, employing trained professionals, and staying updated with the latest cleaning techniques sets us apart from the competition. We don't just wash vehicles; we restore them to their pristine condition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Our <span className="text-[#FCDE04]">Journey</span>
          </h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-[#FCDE04] rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-[#1D1D1D]" />
                  </div>
                  {index !== milestones.length - 1 && (
                    <div className="w-0.5 h-full bg-[#6797BF] mt-2"></div>
                  )}
                </div>
                <div className="pb-8">
                  <div className="text-2xl font-bold text-[#6797BF] mb-2">
                    {milestone.year}
                  </div>
                  <p className="text-gray-700">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-[#FCDE04] to-[#e8cd04] p-8 rounded-xl shadow-xl">
              <div className="w-16 h-16 bg-[#1D1D1D] rounded-full flex items-center justify-center mb-4">
                <Target className="w-8 h-8 text-[#FCDE04]" />
              </div>
              <h3 className="text-3xl font-bold text-[#1D1D1D] mb-4">Our Vision</h3>
              <p className="text-[#1D1D1D] leading-relaxed text-lg">
                To become the most trusted and preferred vehicle cleaning service in Ciomas and surrounding areas, known for our quality, reliability, and unwavering commitment to customer satisfaction. We envision a future where every vehicle owner experiences the joy of a perfectly maintained vehicle.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#6797BF] to-[#5686ae] p-8 rounded-xl shadow-xl">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-[#6797BF]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">Our Mission</h3>
              <p className="text-white leading-relaxed text-lg">
                To provide exceptional vehicle cleaning services using eco-friendly products, trained professionals, and innovative techniques while maintaining affordable prices for all customers. We are committed to continuous improvement and exceeding customer expectations with every service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-[#1D1D1D] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Meet Our <span className="text-[#FCDE04]">Team</span>
          </h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Our dedicated team of professionals is committed to delivering the best vehicle care services.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-[#2D2D2D] p-6 rounded-xl text-center hover:transform hover:scale-105 transition-all"
              >
                {member.photo ? (
                  <ImageWithFallback
                    src={member.photo}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-[#FCDE04]"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#FCDE04] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-[#1D1D1D]" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#FCDE04] mb-2">
                  {member.name}
                </h3>
                <p className="text-[#6797BF] font-semibold mb-2">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Our Core <span className="text-[#FCDE04]">Values</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: 'Quality',
                description: 'We never compromise on the quality of our services and products.',
              },
              {
                title: 'Integrity',
                description: 'Honest, transparent, and ethical in all our business practices.',
              },
              {
                title: 'Customer Focus',
                description: 'Your satisfaction is our top priority in everything we do.',
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center border-t-4 border-[#FCDE04]"
              >
                <h3 className="text-2xl font-bold text-[#1D1D1D] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}