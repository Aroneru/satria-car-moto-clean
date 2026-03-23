"use client";
import { createContext, useContext, useState, ReactNode } from 'react';

interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  features: string[];
  priceMatrix: {
    small?: number;
    medium?: number;
    large?: number;
    extraLarge?: number;
    motorcycleStandard?: number;
    motorcycleMoge?: number;
    motorcycleExtraLarge?: number;
  };
  duration: string;
}

interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
}

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  photo?: string;
}

interface ContactInfo {
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  hours: string;
  facebook: string;
  instagram: string;
}

interface QueueItem {
  id: string;
  queueNumber: string;
  customerName: string;
  phoneNumber: string;
  vehicleType: 'car' | 'motorcycle';
  vehiclePlate: string;
  serviceId: string;
  serviceName: string;
  price: number;
  status: 'waiting' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  queueId?: string;
}

interface ContentContextType {
  services: Service[];
  setServices: (services: Service[]) => void;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  galleryImages: GalleryImage[];
  setGalleryImages: (images: GalleryImage[]) => void;
  teamMembers: TeamMember[];
  setTeamMembers: (members: TeamMember[]) => void;
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  queueItems: QueueItem[];
  setQueueItems: (items: QueueItem[]) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([
    // CAR & MOTORCYCLE WASH
    {
      id: '1',
      icon: 'Droplets',
      title: 'Cuci Hidrolik',
      description: 'Layanan cuci mobil dan motor lengkap dengan Body + Kolong + Vacuum untuk hasil bersih maksimal.',
      features: ['Body wash', 'Kolong cleaning', 'Vacuum interior (mobil)', 'Window cleaning', 'Tire dressing', 'Chain cleaning (motor)'],
      priceMatrix: {
        small: 45000,
        medium: 45000,
        large: 50000,
        extraLarge: 60000,
        motorcycleStandard: 20000,
        motorcycleMoge: 25000,
        motorcycleExtraLarge: 30000,
      },
      duration: '20-40 menit',
    },
    
    // NANO CERAMIC
    {
      id: '3',
      icon: 'Sparkles',
      title: 'Nano Keramik',
      description: 'Pelapisan bodi permanen premium dengan teknologi nano ceramic untuk perlindungan maksimal hingga 2-3 tahun. Memberikan kilap glossy maksimal dan efek hydrophobic.',
      features: [
        'Perlindungan cat hingga 2-3 tahun',
        'Efek hydrophobic (air langsung mengalir)',
        'Kilap glossy maksimal',
        'Tahan goresan ringan',
        'Easy to clean & maintain',
        'Proteksi dari UV dan oksidasi',
        'Aplikasi oleh teknisi bersertifikat'
      ],
      priceMatrix: {
        small: 2400000,
        medium: 2700000,
        large: 3500000,
        extraLarge: 4100000,
        motorcycleStandard: 550000,
        motorcycleMoge: 550000,
        motorcycleExtraLarge: 700000,
      },
      duration: '3-6 jam',
    },
    
    // POLISH
    {
      id: '5',
      icon: 'Car',
      title: 'Polish Mobil',
      description: 'Polish bodi dan perlindungan cat untuk menghilangkan goresan halus dan mengembalikan kilap mobil Anda.',
      features: [
        'Polish bodi menyeluruh',
        'Perlindungan cat',
        'Menghilangkan goresan halus',
        'Mengembalikan kilap original',
        'Wax protection'
      ],
      priceMatrix: {
        small: 800000,
        medium: 900000,
        large: 1000000,
        extraLarge: 1100000,
      },
      duration: '3-4 jam',
    },
    {
      id: '6',
      icon: 'Sparkles',
      title: 'Polish Kaca - Full Coating + Nano',
      description: 'Polish kaca mobil lengkap dengan jamur removal, full coating, dan nano protection untuk visibilitas maksimal.',
      features: [
        'Pembersihan jamur kaca',
        'Polish kaca menyeluruh',
        'Full coating protection',
        'Nano hydrophobic layer',
        'Visibilitas maksimal'
      ],
      priceMatrix: {
        small: 650000,
        medium: 650000,
        large: 650000,
        extraLarge: 650000,
      },
      duration: '2-3 jam',
    },
    {
      id: '7',
      icon: 'Car',
      title: 'Polish Kaca - Full Coating',
      description: 'Polish kaca mobil dengan jamur removal dan full coating protection.',
      features: [
        'Pembersihan jamur kaca',
        'Polish kaca menyeluruh',
        'Full coating protection',
        'Hasil jernih maksimal'
      ],
      priceMatrix: {
        small: 250000,
        medium: 250000,
        large: 250000,
        extraLarge: 250000,
      },
      duration: '1-2 jam',
    },
    
    // HEAD LAMP
    {
      id: '8',
      icon: 'Lightbulb',
      title: 'Head Lamp - Coating',
      description: 'Pembersihan lampu kusam dengan coating protection untuk hasil tahan lama dan perlindungan dari oksidasi.',
      features: [
        'Pembersihan lampu kusam',
        'Polishing headlamp',
        'UV protection coating',
        'Hasil jernih maksimal',
        'Tahan lama'
      ],
      priceMatrix: {
        small: 550000,
        medium: 550000,
        large: 550000,
        extraLarge: 550000,
        motorcycleStandard: 550000,
        motorcycleMoge: 550000,
        motorcycleExtraLarge: 550000,
      },
      duration: '1-2 jam',
    },
    {
      id: '9',
      icon: 'Lightbulb',
      title: 'Head Lamp - Non Coating',
      description: 'Pembersihan dan polishing lampu kusam untuk mengembalikan kejernihan lampu kendaraan Anda.',
      features: [
        'Pembersihan lampu kusam',
        'Polishing headlamp',
        'Hasil jernih',
        'Menghilangkan buram'
      ],
      priceMatrix: {
        small: 350000,
        medium: 350000,
        large: 350000,
        extraLarge: 350000,
        motorcycleStandard: 350000,
        motorcycleMoge: 350000,
        motorcycleExtraLarge: 350000,
      },
      duration: '1 jam',
    },
    
    // OTHER SERVICES
    {
      id: '10',
      icon: 'Armchair',
      title: 'Detailing Interior',
      description: 'Pembersihan interior menyeluruh dan detailing untuk hasil seperti baru.',
      features: [
        'Deep cleaning interior',
        'Leather/fabric treatment',
        'Dashboard detailing',
        'Door panel cleaning',
        'Carpet shampooing',
        'Air freshener'
      ],
      priceMatrix: {
        small: 600000,
        medium: 600000,
        large: 600000,
        extraLarge: 600000,
      },
      duration: '2-3 jam',
    },
    {
      id: '11',
      icon: 'Wrench',
      title: 'Engine Cleaning',
      description: 'Pembersihan mesin profesional untuk performa optimal dan tampilan mesin yang bersih.',
      features: [
        'Deep cleaning mesin',
        'Degreasing',
        'Protection coating',
        'Aman untuk komponen elektronik'
      ],
      priceMatrix: {
        small: 200000,
        medium: 200000,
        large: 200000,
        extraLarge: 200000,
        motorcycleStandard: 200000,
        motorcycleMoge: 200000,
        motorcycleExtraLarge: 200000,
      },
      duration: '1-1.5 jam',
    },
  ]);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Budi Santoso',
      text: 'Excellent service! My car looks brand new. Highly recommended!',
      rating: 5,
    },
    {
      id: '2',
      name: 'Rina Wijaya',
      text: 'Professional and fast. The team is very friendly and thorough.',
      rating: 5,
    },
    {
      id: '3',
      name: 'Ahmad Rizki',
      text: 'Best car wash in Ciomas. Great value for money!',
      rating: 5,
    },
  ]);

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    {
      id: '1',
      url: 'https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=1080',
      title: 'Professional Car Washing',
      category: 'Service',
    },
    {
      id: '2',
      url: 'https://images.unsplash.com/photo-1587350811385-f9bd58daf9e9?w=1080',
      title: 'Showroom Finish',
      category: 'Results',
    },
    {
      id: '3',
      url: 'https://images.unsplash.com/photo-1762418916717-5a3327d76731?w=1080',
      title: 'Motorcycle Care',
      category: 'Service',
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Satria Wijaya',
      role: 'Founder & CEO',
      description: '10+ years experience in automotive care',
    },
    {
      id: '2',
      name: 'Dedi Kusuma',
      role: 'Operations Manager',
      description: 'Certified detailing specialist',
    },
    {
      id: '3',
      name: 'Rina Sari',
      role: 'Customer Service Lead',
      description: 'Dedicated to customer satisfaction',
    },
    {
      id: '4',
      name: 'Ahmad Rizal',
      role: 'Lead Technician',
      description: 'Expert in premium detailing',
    },
  ]);

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: 'Jl. Raya Ciomas No. 123\nCiomas, Bogor\nWest Java, Indonesia 16610',
    phone1: '+62 812-3456-7890',
    phone2: '+62 821-9876-5432',
    email1: 'info@satriaclean.com',
    email2: 'booking@satriaclean.com',
    hours: 'Monday - Saturday: 08:00 - 18:00\nSunday: 09:00 - 15:00',
    facebook: '#',
    instagram: '#',
  });

  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  return (
    <ContentContext.Provider
      value={{
        services,
        setServices,
        testimonials,
        setTestimonials,
        galleryImages,
        setGalleryImages,
        teamMembers,
        setTeamMembers,
        contactInfo,
        setContactInfo,
        queueItems,
        setQueueItems,
        transactions,
        setTransactions,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}