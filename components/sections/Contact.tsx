'use client';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';
import Image from 'next/image';

export function Contact() {
  const { contactInfo } = useContent();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will contact you soon.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1D1D1D] to-[#2D2D2D] text-white py-20 relative overflow-hidden">
        {/* Water Droplet Decorations */}
        <div className="absolute top-10 left-1/4 w-16 h-16 bg-[#6797BF] rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-10 right-1/4 w-24 h-24 bg-[#6797BF] rounded-full opacity-15 blur-2xl"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6">
            Get In <span className="text-[#FCDE04]">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions or ready to book a service? We're here to help. Contact us today!
          </p>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold text-[#1D1D1D] mb-8">
                Contact <span className="text-[#FCDE04]">Information</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FCDE04] rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#1D1D1D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1D1D1D] mb-1">Address</h3>
                    <p className="text-gray-700">
                      {contactInfo.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#6797BF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1D1D1D] mb-1">Phone</h3>
                    <p className="text-gray-700">{contactInfo.phone1}</p>
                    <p className="text-gray-700">{contactInfo.phone2}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#FCDE04] rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#1D1D1D]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1D1D1D] mb-1">Email</h3>
                    <p className="text-gray-700">{contactInfo.email1}</p>
                    <p className="text-gray-700">{contactInfo.email2}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#6797BF] rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1D1D1D] mb-1">Operating Hours</h3>
                    <p className="text-gray-700">Monday - Saturday: 08:00 - 18:00</p>
                    <p className="text-gray-700">Sunday: 09:00 - 15:00</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-semibold text-[#1D1D1D] mb-4">Follow Us</h3>
                <div className="flex gap-4 flex-wrap">
                  {contactInfo.socialMedia.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                      title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
                    >
                      <Image
                        src={`/images/${social.platform}.png`}
                        alt={social.platform}
                        width={40}
                        height={40}
                      />
                    </a>
                  ))}
                </div>
                {contactInfo.socialMedia.length === 0 && (
                  <p className="text-gray-500 text-sm">No social media links available</p>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#1D1D1D] mb-6">
                Send Us a <span className="text-[#FCDE04]">Message</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04]"
                    placeholder="+62 812-3456-7890"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-[#1D1D1D] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#FCDE04] text-[#1D1D1D] px-6 py-3 rounded-lg font-semibold hover:bg-[#e8cd04] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-[#1D1D1D] mb-12">
            Find <span className="text-[#FCDE04]">Us</span>
          </h2>
          <div className="max-w-5xl mx-auto">
            <div className="aspect-video bg-gray-300 rounded-xl overflow-hidden shadow-xl">
              {/* Google Maps Embed - Replace with actual coordinates */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126748.56347862248!2d106.68942865!3d-6.5971469!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5d2e5e0b5a1%3A0x5030bfbcaf7c3b0!2sCiomas%2C%20Bogor%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Satria Car & Moto Clean Location"
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://maps.google.com/?q=Ciomas+Bogor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#6797BF] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5686ae] transition-colors"
              >
                <MapPin className="w-5 h-5" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#FCDE04] to-[#e8cd04]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#1D1D1D] mb-4">
            Visit Us Today!
          </h2>
          <p className="text-xl text-[#1D1D1D] mb-8">
            Experience the best vehicle cleaning service in Ciomas
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="tel:+6281234567890"
              className="bg-[#1D1D1D] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2D2D2D] transition-colors inline-flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#20bd5a] transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}