-- Dashboard seed data based on the previous in-app defaults.
-- Safe to run multiple times.

begin;

insert into public.services (
  id,
  name,
  title,
  category,
  description,
  features,
  price,
  duration_minutes,
  duration_label,
  is_active,
  sort_order
)
values
  (
    '11111111-1111-1111-1111-111111111001',
    'Cuci Hidrolik',
    'Cuci Hidrolik',
    'both',
    'Layanan cuci mobil dan motor lengkap dengan Body + Kolong + Vacuum untuk hasil bersih maksimal.',
    array['Body wash', 'Kolong cleaning', 'Vacuum interior (mobil)', 'Window cleaning', 'Tire dressing', 'Chain cleaning (motor)'],
    20000,
    20,
    '20-40 menit',
    true,
    1
  ),
  (
    '11111111-1111-1111-1111-111111111003',
    'Nano Keramik',
    'Nano Keramik',
    'both',
    'Pelapisan bodi permanen premium dengan teknologi nano ceramic untuk perlindungan maksimal hingga 2-3 tahun. Memberikan kilap glossy maksimal dan efek hydrophobic.',
    array[
      'Perlindungan cat hingga 2-3 tahun',
      'Efek hydrophobic (air langsung mengalir)',
      'Kilap glossy maksimal',
      'Tahan goresan ringan',
      'Easy to clean & maintain',
      'Proteksi dari UV dan oksidasi',
      'Aplikasi oleh teknisi bersertifikat'
    ],
    550000,
    180,
    '3-6 jam',
    true,
    2
  ),
  (
    '11111111-1111-1111-1111-111111111005',
    'Polish Mobil',
    'Polish Mobil',
    'car',
    'Polish bodi dan perlindungan cat untuk menghilangkan goresan halus dan mengembalikan kilap mobil Anda.',
    array[
      'Polish bodi menyeluruh',
      'Perlindungan cat',
      'Menghilangkan goresan halus',
      'Mengembalikan kilap original',
      'Wax protection'
    ],
    800000,
    180,
    '3-4 jam',
    true,
    3
  ),
  (
    '11111111-1111-1111-1111-111111111006',
    'Polish Kaca - Full Coating + Nano',
    'Polish Kaca - Full Coating + Nano',
    'car',
    'Polish kaca mobil lengkap dengan jamur removal, full coating, dan nano protection untuk visibilitas maksimal.',
    array[
      'Pembersihan jamur kaca',
      'Polish kaca menyeluruh',
      'Full coating protection',
      'Nano hydrophobic layer',
      'Visibilitas maksimal'
    ],
    650000,
    120,
    '2-3 jam',
    true,
    4
  ),
  (
    '11111111-1111-1111-1111-111111111007',
    'Polish Kaca - Full Coating',
    'Polish Kaca - Full Coating',
    'car',
    'Polish kaca mobil dengan jamur removal dan full coating protection.',
    array[
      'Pembersihan jamur kaca',
      'Polish kaca menyeluruh',
      'Full coating protection',
      'Hasil jernih maksimal'
    ],
    250000,
    60,
    '1-2 jam',
    true,
    5
  ),
  (
    '11111111-1111-1111-1111-111111111008',
    'Head Lamp - Coating',
    'Head Lamp - Coating',
    'both',
    'Pembersihan lampu kusam dengan coating protection untuk hasil tahan lama dan perlindungan dari oksidasi.',
    array[
      'Pembersihan lampu kusam',
      'Polishing headlamp',
      'UV protection coating',
      'Hasil jernih maksimal',
      'Tahan lama'
    ],
    550000,
    60,
    '1-2 jam',
    true,
    6
  ),
  (
    '11111111-1111-1111-1111-111111111009',
    'Head Lamp - Non Coating',
    'Head Lamp - Non Coating',
    'both',
    'Pembersihan dan polishing lampu kusam untuk mengembalikan kejernihan lampu kendaraan Anda.',
    array[
      'Pembersihan lampu kusam',
      'Polishing headlamp',
      'Hasil jernih',
      'Menghilangkan buram'
    ],
    350000,
    60,
    '1 jam',
    true,
    7
  ),
  (
    '11111111-1111-1111-1111-111111111010',
    'Detailing Interior',
    'Detailing Interior',
    'car',
    'Pembersihan interior menyeluruh dan detailing untuk hasil seperti baru.',
    array[
      'Deep cleaning interior',
      'Leather/fabric treatment',
      'Dashboard detailing',
      'Door panel cleaning',
      'Carpet shampooing',
      'Air freshener'
    ],
    600000,
    120,
    '2-3 jam',
    true,
    8
  ),
  (
    '11111111-1111-1111-1111-111111111011',
    'Engine Cleaning',
    'Engine Cleaning',
    'both',
    'Pembersihan mesin profesional untuk performa optimal dan tampilan mesin yang bersih.',
    array[
      'Deep cleaning mesin',
      'Degreasing',
      'Protection coating',
      'Aman untuk komponen elektronik'
    ],
    200000,
    60,
    '1-1.5 jam',
    true,
    9
  )
on conflict (id) do update
set
  name = excluded.name,
  title = excluded.title,
  category = excluded.category,
  description = excluded.description,
  features = excluded.features,
  price = excluded.price,
  duration_minutes = excluded.duration_minutes,
  duration_label = excluded.duration_label,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.service_prices (service_id, size_key, amount)
values
  ('11111111-1111-1111-1111-111111111001', 'small', 45000),
  ('11111111-1111-1111-1111-111111111001', 'medium', 45000),
  ('11111111-1111-1111-1111-111111111001', 'large', 50000),
  ('11111111-1111-1111-1111-111111111001', 'extraLarge', 60000),
  ('11111111-1111-1111-1111-111111111001', 'motorcycleStandard', 20000),
  ('11111111-1111-1111-1111-111111111001', 'motorcycleMoge', 25000),
  ('11111111-1111-1111-1111-111111111001', 'motorcycleExtraLarge', 30000),

  ('11111111-1111-1111-1111-111111111003', 'small', 2400000),
  ('11111111-1111-1111-1111-111111111003', 'medium', 2700000),
  ('11111111-1111-1111-1111-111111111003', 'large', 3500000),
  ('11111111-1111-1111-1111-111111111003', 'extraLarge', 4100000),
  ('11111111-1111-1111-1111-111111111003', 'motorcycleStandard', 550000),
  ('11111111-1111-1111-1111-111111111003', 'motorcycleMoge', 550000),
  ('11111111-1111-1111-1111-111111111003', 'motorcycleExtraLarge', 700000),

  ('11111111-1111-1111-1111-111111111005', 'small', 800000),
  ('11111111-1111-1111-1111-111111111005', 'medium', 900000),
  ('11111111-1111-1111-1111-111111111005', 'large', 1000000),
  ('11111111-1111-1111-1111-111111111005', 'extraLarge', 1100000),

  ('11111111-1111-1111-1111-111111111006', 'small', 650000),
  ('11111111-1111-1111-1111-111111111006', 'medium', 650000),
  ('11111111-1111-1111-1111-111111111006', 'large', 650000),
  ('11111111-1111-1111-1111-111111111006', 'extraLarge', 650000),

  ('11111111-1111-1111-1111-111111111007', 'small', 250000),
  ('11111111-1111-1111-1111-111111111007', 'medium', 250000),
  ('11111111-1111-1111-1111-111111111007', 'large', 250000),
  ('11111111-1111-1111-1111-111111111007', 'extraLarge', 250000),

  ('11111111-1111-1111-1111-111111111008', 'small', 550000),
  ('11111111-1111-1111-1111-111111111008', 'medium', 550000),
  ('11111111-1111-1111-1111-111111111008', 'large', 550000),
  ('11111111-1111-1111-1111-111111111008', 'extraLarge', 550000),
  ('11111111-1111-1111-1111-111111111008', 'motorcycleStandard', 550000),
  ('11111111-1111-1111-1111-111111111008', 'motorcycleMoge', 550000),
  ('11111111-1111-1111-1111-111111111008', 'motorcycleExtraLarge', 550000),

  ('11111111-1111-1111-1111-111111111009', 'small', 350000),
  ('11111111-1111-1111-1111-111111111009', 'medium', 350000),
  ('11111111-1111-1111-1111-111111111009', 'large', 350000),
  ('11111111-1111-1111-1111-111111111009', 'extraLarge', 350000),
  ('11111111-1111-1111-1111-111111111009', 'motorcycleStandard', 350000),
  ('11111111-1111-1111-1111-111111111009', 'motorcycleMoge', 350000),
  ('11111111-1111-1111-1111-111111111009', 'motorcycleExtraLarge', 350000),

  ('11111111-1111-1111-1111-111111111010', 'small', 600000),
  ('11111111-1111-1111-1111-111111111010', 'medium', 600000),
  ('11111111-1111-1111-1111-111111111010', 'large', 600000),
  ('11111111-1111-1111-1111-111111111010', 'extraLarge', 600000),

  ('11111111-1111-1111-1111-111111111011', 'small', 200000),
  ('11111111-1111-1111-1111-111111111011', 'medium', 200000),
  ('11111111-1111-1111-1111-111111111011', 'large', 200000),
  ('11111111-1111-1111-1111-111111111011', 'extraLarge', 200000),
  ('11111111-1111-1111-1111-111111111011', 'motorcycleStandard', 200000),
  ('11111111-1111-1111-1111-111111111011', 'motorcycleMoge', 200000),
  ('11111111-1111-1111-1111-111111111011', 'motorcycleExtraLarge', 200000)
on conflict (service_id, size_key) do update
set amount = excluded.amount;

insert into public.testimonials (id, name, text, rating, is_visible, sort_order)
values
  (
    '22222222-2222-2222-2222-222222222001',
    'Budi Santoso',
    'Excellent service! My car looks brand new. Highly recommended!',
    5,
    true,
    1
  ),
  (
    '22222222-2222-2222-2222-222222222002',
    'Rina Wijaya',
    'Professional and fast. The team is very friendly and thorough.',
    5,
    true,
    2
  ),
  (
    '22222222-2222-2222-2222-222222222003',
    'Ahmad Rizki',
    'Best car wash in Ciomas. Great value for money!',
    5,
    true,
    3
  )
on conflict (id) do update
set
  name = excluded.name,
  text = excluded.text,
  rating = excluded.rating,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;

insert into public.gallery_images (
  id,
  title,
  image_url,
  category,
  is_visible,
  sort_order
)
values
  (
    '33333333-3333-3333-3333-333333333001',
    'Professional Car Washing',
    'https://images.unsplash.com/photo-1552930294-6b595f4c2974?w=1080',
    'Service',
    true,
    1
  ),
  (
    '33333333-3333-3333-3333-333333333002',
    'Showroom Finish',
    'https://images.unsplash.com/photo-1587350811385-f9bd58daf9e9?w=1080',
    'Results',
    true,
    2
  ),
  (
    '33333333-3333-3333-3333-333333333003',
    'Motorcycle Care',
    'https://images.unsplash.com/photo-1762418916717-5a3327d76731?w=1080',
    'Service',
    true,
    3
  )
on conflict (id) do update
set
  title = excluded.title,
  image_url = excluded.image_url,
  category = excluded.category,
  is_visible = excluded.is_visible,
  sort_order = excluded.sort_order;

insert into public.team_members (
  id,
  name,
  role,
  description,
  is_active,
  sort_order
)
values
  (
    '44444444-4444-4444-4444-444444444001',
    'Satria Wijaya',
    'Founder & CEO',
    '10+ years experience in automotive care',
    true,
    1
  ),
  (
    '44444444-4444-4444-4444-444444444002',
    'Dedi Kusuma',
    'Operations Manager',
    'Certified detailing specialist',
    true,
    2
  ),
  (
    '44444444-4444-4444-4444-444444444003',
    'Rina Sari',
    'Customer Service Lead',
    'Dedicated to customer satisfaction',
    true,
    3
  ),
  (
    '44444444-4444-4444-4444-444444444004',
    'Ahmad Rizal',
    'Lead Technician',
    'Expert in premium detailing',
    true,
    4
  )
on conflict (id) do update
set
  name = excluded.name,
  role = excluded.role,
  description = excluded.description,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order;

insert into public.contact_info (
  id,
  address,
  phone1,
  phone2,
  email1,
  email2,
  hours,
  facebook,
  instagram
)
values (
  true,
  E'Jl. Raya Ciomas No. 123\nCiomas, Bogor\nWest Java, Indonesia 16610',
  '+62 812-3456-7890',
  '+62 821-9876-5432',
  'info@satriaclean.com',
  'booking@satriaclean.com',
  E'Monday - Saturday: 08:00 - 18:00\nSunday: 09:00 - 15:00',
  '#',
  '#'
)
on conflict (id) do update
set
  address = excluded.address,
  phone1 = excluded.phone1,
  phone2 = excluded.phone2,
  email1 = excluded.email1,
  email2 = excluded.email2,
  hours = excluded.hours,
  facebook = excluded.facebook,
  instagram = excluded.instagram;

commit;
