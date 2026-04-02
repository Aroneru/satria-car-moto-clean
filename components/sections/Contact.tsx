import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { useContent } from '../../context/ContentContext';

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
                <div className="flex gap-3 flex-wrap">
                  {contactInfo.socialLinks
                    .filter((s) => s.url && s.url.trim() !== '')
                    .map((s) => {
                      const CONFIGS: Record<string, { label: string; img?: string; fallbackIcon?: JSX.Element }> = {
                        facebook:  { label: 'Facebook',  img: '/images/facebook.png' },
                        instagram: { label: 'Instagram', img: '/images/instagram.png' },
                        tiktok:    { label: 'TikTok',    img: '/images/tiktok.png' },
                        youtube:   { label: 'YouTube',   img: '/images/youtube.png' },
                        whatsapp:  {
                          label: 'WhatsApp',
                          fallbackIcon: (
                            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#25D366]">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                            </svg>
                          ),
                        },
                      };
                      const cfg = CONFIGS[s.platform];
                      if (!cfg) return null;
                      return (
                        <a
                          key={s.platform}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={cfg.label}
                          className="w-12 h-12 rounded-full flex items-center justify-center bg-white border-2 border-[#FCDE04] transition-all hover:scale-110 hover:shadow-md shadow-sm"
                        >
                          {cfg.img ? (
                            <img src={cfg.img} alt={cfg.label} className="w-6 h-6 object-contain" />
                          ) : (
                            cfg.fallbackIcon
                          )}
                        </a>
                      );
                    })}
                </div>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FCDE04] resize-none bg-gray-200 text-black placeholder-gray-500 autofill:bg-gray-200 autofill:text-black"
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