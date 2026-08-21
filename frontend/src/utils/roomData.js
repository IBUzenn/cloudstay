/**
 * Room Visual & Facility Data Provider
 * Enriches room objects with high-resolution accommodation photography,
 * room-level facility breakdowns, proximity metadata, and gallery helpers.
 */

// Curated high-resolution accommodation images from Unsplash (architecture & student housing)
export const ACCOMMODATION_PHOTOS = {
  single: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', // Single room with bed & desk
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', // Study desk & window
    'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80', // Wardrobe & storage
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', // Clean bathroom
  ],
  double: [
    'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', // Twin bed room
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80', // Study workstations
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80', // Room angle with storage
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', // Modern bathroom
  ],
  triple: [
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', // Multi-bed studio
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', // Study desk setup
    'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80', // Storage lockers
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', // Common study space
  ],
  suite: [
    'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80', // Executive suite bedroom
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', // Suite living area
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', // Private en-suite
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', // Exterior balcony view
  ],
  default: [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
  ]
};

// Hostel exterior photo highlights
export const HOSTEL_EXTERIOR_PHOTOS = {
  1: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80', // Blue Block
  2: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80', // Green Block
  3: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80', // Unity Hall
  4: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80', // Excellence Annex
};

/**
 * Returns gallery photo URLs for a given room and hostel.
 */
export function getRoomGallery(room, hostel) {
  const roomType = (room?.room_type || '').toLowerCase();
  const photos = ACCOMMODATION_PHOTOS[roomType] || ACCOMMODATION_PHOTOS.default;
  const hostelPhoto = HOSTEL_EXTERIOR_PHOTOS[hostel?.id || room?.hostel_id] || HOSTEL_EXTERIOR_PHOTOS[1];

  return [
    photos[0],
    photos[1],
    photos[2],
    photos[3] || hostelPhoto,
  ];
}

/**
 * Standard room-level amenities tailored by room type & capacity.
 */
export function getRoomFacilities(room) {
  const capacity = room?.capacity || 1;
  const roomType = (room?.room_type || '').toLowerCase();

  const facilities = [
    {
      id: 'bed',
      icon: 'BedDouble',
      name: `${capacity} Single Bed${capacity > 1 ? 's' : ''}`,
      desc: 'Comfortable orthopaedic mattress with mattress protector',
      category: 'Sleeping'
    },
    {
      id: 'desk',
      icon: 'BookOpen',
      name: `${capacity} Dedicated Study Desk${capacity > 1 ? 's' : ''}`,
      desc: 'Ergonomic chair, study lamp mount & reading space',
      category: 'Study'
    },
    {
      id: 'storage',
      icon: 'Archive',
      name: 'Personal Storage & Lockers',
      desc: 'Lockable wardrobe, shelving and under-bed storage',
      category: 'Storage'
    },
    {
      id: 'power',
      icon: 'Zap',
      name: 'Dual Power Outlets & USB',
      desc: 'Convenient power points near desk and bed space',
      category: 'Utilities'
    },
    {
      id: 'wifi',
      icon: 'Wifi',
      name: 'High-Speed Campus Wi-Fi',
      desc: 'Dedicated Wi-Fi access point in every room corridor',
      category: 'Connectivity'
    },
    {
      id: 'window',
      icon: 'Sun',
      name: 'Natural Lighting & Airflow',
      desc: 'Large glass window with blackout curtains & ventilation',
      category: 'Environment'
    }
  ];

  if (roomType === 'suite' || roomType === 'single') {
    facilities.push({
      id: 'ensuite',
      icon: 'Bath',
      name: 'Private En-suite Bathroom',
      desc: 'Attached bathroom with hot shower and vanity mirror',
      category: 'Sanitation'
    });
  }

  if (roomType === 'suite' || room?.price_per_semester > 2500) {
    facilities.push({
      id: 'ac',
      icon: 'Wind',
      name: 'Air Conditioning',
      desc: 'Climate-controlled split AC unit with remote control',
      category: 'Environment'
    });
  }

  return facilities;
}

/**
 * Hostel-wide amenities mapping for visual icons.
 */
export const AMENITY_ICONS = {
  'WiFi': 'Wifi',
  '24/7 Security': 'Shield',
  'Common Room': 'Users',
  'Laundry': 'Shirt',
  'CCTV': 'Video',
  'Backup Generator': 'Zap',
  'Air Conditioning': 'Wind',
  'Study Lounge': 'BookOpen',
  'Cafeteria': 'Utensils',
  'Parking': 'Car',
  'En-suite Bathroom': 'Bath',
  'Gym': 'Dumbbell',
  'Default': 'CheckCircle2'
};

/**
 * Returns campus proximity points for accommodation context.
 */
export function getCampusProximity(hostel) {
  const location = (hostel?.location || '').toLowerCase();

  if (location.includes('north')) {
    return [
      { label: 'Central Library', time: '4 min walk', mode: 'walk' },
      { label: 'Science Complex', time: '6 min walk', mode: 'walk' },
      { label: 'Campus Bus Terminal', time: '2 min walk', mode: 'walk' },
      { label: 'Student Cafeteria', time: '3 min walk', mode: 'walk' },
    ];
  } else if (location.includes('south')) {
    return [
      { label: 'Main Auditorium', time: '5 min walk', mode: 'walk' },
      { label: 'Law & Humanities Block', time: '3 min walk', mode: 'walk' },
      { label: 'Sports Stadium', time: '7 min walk', mode: 'walk' },
      { label: 'Medical Centre', time: '5 min walk', mode: 'walk' },
    ];
  } else if (location.includes('east')) {
    return [
      { label: 'Postgraduate School', time: '3 min walk', mode: 'walk' },
      { label: 'Engineering Labs', time: '5 min walk', mode: 'walk' },
      { label: 'Research Institute', time: '4 min walk', mode: 'walk' },
      { label: 'Commercial Bank & ATM', time: '2 min walk', mode: 'walk' },
    ];
  }

  return [
    { label: 'Main Lecture Hall', time: '5 min walk', mode: 'walk' },
    { label: 'University Library', time: '6 min walk', mode: 'walk' },
    { label: 'Student Union Building', time: '4 min walk', mode: 'walk' },
    { label: 'Campus Dining Hall', time: '3 min walk', mode: 'walk' },
  ];
}
