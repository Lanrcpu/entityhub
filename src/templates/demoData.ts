/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusinessInfo } from '../types';

export const DEFAULT_SECTION_ORDER = [
  'hero',
  'facts',
  'services',
  'products',
  'gallery',
  'faq',
  'contact'
];

export const demoTemplates: { [key: string]: { label: string; data: BusinessInfo } } = {
  coffeeShop: {
    label: '☕ The Daily Grind (Coffee & Bakery)',
    data: {
      name: 'The Daily Grind',
      category: 'Coffee Shop & Bakery',
      description: 'An artisanal neighborhood coffee house and micro-bakery. We roast our ethically sourced single-origin beans in-house and bake fresh sourdough pastries daily. Our mission is to foster community, one perfect pour-over at a time, in a cozy and welcoming space.',
      tagline: 'Ethically Sourced. Micro-Roasted. Baked Fresh Daily.',
      address: {
        street: '452 Linden Avenue',
        city: 'Portland',
        state: 'OR',
        postalCode: '97202',
        country: 'United States'
      },
      phone: '+1 (503) 555-0143',
      email: 'hello@thedailygrindportland.com',
      whatsapp: '+15035550143',
      googleBusinessProfileUrl: 'https://business.google.com/r/01234567890123456789',
      googleMapsUrl: 'https://maps.app.goo.gl/YVpB8XgY2X77S5f8A',
      website: 'https://thedailygrindportland.com',
      socials: {
        facebook: 'https://facebook.com/thedailygrindpdx',
        twitter: 'https://twitter.com/thedailygrindpdx',
        instagram: 'https://instagram.com/thedailygrindpdx',
        linkedin: '',
        youtube: ''
      },
      openingHours: [
        { day: 'Monday', open: '07:00', close: '16:00', closed: false },
        { day: 'Tuesday', open: '07:00', close: '16:00', closed: false },
        { day: 'Wednesday', open: '07:00', close: '16:00', closed: false },
        { day: 'Thursday', open: '07:00', close: '16:00', closed: false },
        { day: 'Friday', open: '07:00', close: '17:00', closed: false },
        { day: 'Saturday', open: '08:00', close: '17:00', closed: false },
        { day: 'Sunday', open: '08:00', close: '15:00', closed: false }
      ],
      products: [
        {
          id: 'p1',
          name: 'Signature House Blend (12oz)',
          description: 'Ethically sourced medium roast with tasting notes of milk chocolate, orange peel, and toasted almond.',
          price: '$18.50',
          category: 'Coffee Beans',
          image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
          purchaseUrl: 'https://thedailygrindportland.com/shop/signature-blend'
        },
        {
          id: 'p2',
          name: 'Laminated Almond Croissant',
          description: 'Twice-baked butter croissant loaded with rich almond frangipane and topped with sliced toasted almonds.',
          price: '$5.75',
          category: 'Pastries',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
          purchaseUrl: 'https://thedailygrindportland.com/order/almond-croissant'
        },
        {
          id: 'p3',
          name: 'Double-Walled Glass Mug',
          description: 'A custom BACS-insulated borosilicate glass mug displaying our engraved logo. Keeps coffee hot and hands comfortable.',
          price: '$22.00',
          category: 'Merchandise',
          image: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?auto=format&fit=crop&w=600&q=80',
          purchaseUrl: 'https://thedailygrindportland.com/shop/glass-mug'
        }
      ],
      services: [
        {
          id: 's1',
          name: 'Home Barista Masterclass',
          description: 'A 2-hour hands-on workshop covering espresso extraction, milk texturing, and latte art basics.',
          price: '$85.00',
          category: 'Workshops'
        },
        {
          id: 's2',
          name: 'Office Catering Setup',
          description: 'Premium drip coffee airpots and an assortment of fresh-baked pastries delivered straight to your meeting.',
          price: '$120.00',
          category: 'Catering'
        }
      ],
      faqs: [
        {
          id: 'f1',
          question: 'Do you offer gluten-free pastry options?',
          answer: 'Yes! We bake a selection of gluten-free friendly items, including our almond flour chocolate cookies and daily flourless muffins. Please note we are not a certified gluten-free facility.'
        },
        {
          id: 'f2',
          question: 'Is there high-speed Wi-Fi available for remote work?',
          answer: 'We offer complimentary high-speed Wi-Fi for all customers. To keep our community active, we have designated laptop-free zones near the garden terrace on weekends.'
        },
        {
          id: 'f3',
          question: 'Do you roast your own coffee beans?',
          answer: 'Absolutely! We roast in small batches on our custom-restored Probat roaster twice a week. You can always check the roast date on the bag.'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80'
      ],
      logo: '☕',
      coordinates: {
        latitude: '45.4891',
        longitude: '-122.6514'
      },
      canonicalUrl: 'https://thedailygrindpdx.github.io',
      theme: {
        style: 'warm',
        primaryColor: '#7c2d12', // deep orange/brown
        secondaryColor: '#fef3c7', // warm amber/yellow
        bgColor: '#fdfbf7', // soft warm off-white
        textColor: '#292524' // warm slate gray/black
      },
      typography: 'playfair',
      sectionOrder: DEFAULT_SECTION_ORDER
    }
  },
  agency: {
    label: '✨ PixelCraft (Creative Studio & Design Agency)',
    data: {
      name: 'PixelCraft Studio',
      category: 'Digital Design & Development Agency',
      description: 'An independent design and engineering studio crafting premium web interfaces, high-impact branding systems, and intuitive mobile applications. We partner with ambitious startups and established corporations to create unforgettable digital experiences.',
      tagline: 'Designing the Next Generation of Digital Products.',
      address: {
        street: '820 Broadway, Suite 400',
        city: 'New York',
        state: 'NY',
        postalCode: '10003',
        country: 'United States'
      },
      phone: '+1 (212) 555-0189',
      email: 'engage@pixelcraftstudio.com',
      whatsapp: '',
      googleBusinessProfileUrl: 'https://business.google.com/r/11223344556677889900',
      googleMapsUrl: 'https://maps.app.goo.gl/BroadwaySample',
      website: 'https://pixelcraftstudio.com',
      socials: {
        facebook: '',
        twitter: 'https://twitter.com/pixelcraft_nyc',
        instagram: 'https://instagram.com/pixelcraft_nyc',
        linkedin: 'https://linkedin.com/company/pixelcraft-nyc',
        youtube: ''
      },
      openingHours: [
        { day: 'Monday', open: '09:00', close: '18:00', closed: false },
        { day: 'Tuesday', open: '09:00', close: '18:00', closed: false },
        { day: 'Wednesday', open: '09:00', close: '18:00', closed: false },
        { day: 'Thursday', open: '09:00', close: '18:00', closed: false },
        { day: 'Friday', open: '09:00', close: '17:00', closed: false },
        { day: 'Saturday', open: '00:00', close: '00:00', closed: true },
        { day: 'Sunday', open: '00:00', close: '00:00', closed: true }
      ],
      products: [],
      services: [
        {
          id: 's1',
          name: 'Brand Architecture & Visual System',
          description: 'Comprehensive brand identity design, including typography selection, logo development, messaging, and a robust component style guide.',
          price: '$12,000.00',
          category: 'Design'
        },
        {
          id: 's2',
          name: 'Custom Web & Mobile Development',
          description: 'High-performance, search-optimized custom front-end development using React, static site generators, and clean database integrations.',
          price: '$25,000.00',
          category: 'Engineering'
        },
        {
          id: 's3',
          name: 'Interactive UI/UX Audit',
          description: 'A 10-day expert analysis of your product\'s usability, design layout, accessibility, and loading performance with direct video feedback.',
          price: '$4,500.00',
          category: 'Consulting'
        }
      ],
      faqs: [
        {
          id: 'f1',
          question: 'What is your typical project timeline?',
          answer: 'A comprehensive branding and website design project typically takes between 6 to 10 weeks from inception to final deployment. UI/UX Audits are completed within 10 business days.'
        },
        {
          id: 'f2',
          question: 'Do you work with early-stage pre-funding startups?',
          answer: 'We absolutely love working with early founders! We offer an intensive 1-week Design Sprint package specifically optimized to establish high-fidelity mockups for investor pitches.'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
      ],
      logo: '✨',
      coordinates: {
        latitude: '40.7295',
        longitude: '-73.9912'
      },
      canonicalUrl: 'https://pixelcraft.pages.dev',
      theme: {
        style: 'minimal',
        primaryColor: '#3b82f6', // modern neon blue
        secondaryColor: '#f0f9ff', // light sky
        bgColor: '#fafafa', // pure clean light white
        textColor: '#18181b' // deep zinc gray
      },
      typography: 'space-grotesk',
      sectionOrder: DEFAULT_SECTION_ORDER
    }
  },
  plumber: {
    label: '🔧 FlowTech (Professional Plumber & Heating)',
    data: {
      name: 'FlowTech Plumbing & Heating',
      category: 'Plumbing & Maintenance Contractor',
      description: 'Licensed, insured, and family-operated residential plumbing and heating specialists. For over 15 years, we have provided premium emergency plumbing repairs, water heater replacements, and sewer system diagnostic services to our local community with zero hidden fees.',
      tagline: 'Reliable Service. Transparent Pricing. Fast Response.',
      address: {
        street: '1402 Oak Ridge Boulevard',
        city: 'Denver',
        state: 'CO',
        postalCode: '80204',
        country: 'United States'
      },
      phone: '+1 (303) 555-0162',
      email: 'service@flowtechdenver.com',
      whatsapp: '+13035550162',
      googleBusinessProfileUrl: 'https://business.google.com/r/plumbing-sample',
      googleMapsUrl: 'https://maps.app.goo.gl/DenverSample',
      website: '',
      socials: {
        facebook: 'https://facebook.com/flowtechdenver',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      openingHours: [
        { day: 'Monday', open: '08:00', close: '18:00', closed: false },
        { day: 'Tuesday', open: '08:00', close: '18:00', closed: false },
        { day: 'Wednesday', open: '08:00', close: '18:00', closed: false },
        { day: 'Thursday', open: '08:00', close: '18:00', closed: false },
        { day: 'Friday', open: '08:00', close: '18:00', closed: false },
        { day: 'Saturday', open: '09:00', close: '15:00', closed: false },
        { day: 'Sunday', open: '00:00', close: '00:00', closed: true }
      ],
      products: [
        {
          id: 'p1',
          name: 'EcoSmart Smart Water Shut-off Valve',
          description: 'An automatic leak-detection and water shutoff valve that connects directly to your home Wi-Fi to alert you of pipe breaks.',
          price: '$349.00',
          category: 'Smart Plumbing',
          image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
          purchaseUrl: 'https://flowtechdenver.com/shop/ecosmart-valve'
        }
      ],
      services: [
        {
          id: 's1',
          name: 'Emergency Pipe Leak & Burst Repair',
          description: 'Rapid response containment and replacement of copper, PEX, or PVC piping. Available during operating hours.',
          price: 'Hourly rate + parts',
          category: 'Emergency Repairs'
        },
        {
          id: 's2',
          name: 'Hybrid Heat Pump Water Heater Install',
          description: 'Complete installation of an energy-efficient hybrid electric tank water heater, including old unit eco-disposal.',
          price: '$2,400.00',
          category: 'Installations'
        },
        {
          id: 's3',
          name: 'Sewer Line Video Inspector Diagnostic',
          description: 'High-definition optical camera scan of main drain sewer lines to precisely locate root intrusion or line collapses.',
          price: '$180.00',
          category: 'Diagnostics'
        }
      ],
      faqs: [
        {
          id: 'f1',
          question: 'Do you charge a flat dispatch fee to visit?',
          answer: 'We charge a transparent $49 dispatch fee to cover travel and visual diagnosis. This dispatch fee is completely waived if you hire us to complete any proposed service!'
        },
        {
          id: 'f2',
          question: 'Are your technicians licensed and background checked?',
          answer: 'Yes, 100%. All FlowTech plumbers are fully licensed, bonded, insured, and have undergone rigorous background checks and regular drug screenings for your safety.'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'
      ],
      logo: '🔧',
      coordinates: {
        latitude: '39.7392',
        longitude: '-104.9903'
      },
      canonicalUrl: 'https://flowtechplumbing.github.io',
      theme: {
        style: 'corporate',
        primaryColor: '#0f766e', // professional dark teal
        secondaryColor: '#ccfbf1', // soft teal accent
        bgColor: '#fcfdfd', // corporate ultra-clean off-white
        textColor: '#1f2937' // dark slate
      },
      typography: 'inter',
      sectionOrder: DEFAULT_SECTION_ORDER
    }
  },
  consultant: {
    label: '📈 Vanguard Advisory (Solo Consultant / Advisor)',
    data: {
      name: 'Vanguard Advisory Group',
      category: 'Financial Planning & Wealth Consultancy',
      description: 'A boutique advisory practice spearheaded by Senior Advisor Marcus Sterling. We provide objective, commission-free fiduciary wealth advisory, retirement modeling, and estate strategy services tailored to professionals, high-earning tech workers, and growing families.',
      tagline: 'Objective Counsel. Fiduciary Duty. Preserving Wealth.',
      address: {
        street: '120 San Sansome Street, Suite 1500',
        city: 'San Francisco',
        state: 'CA',
        postalCode: '94104',
        country: 'United States'
      },
      phone: '+1 (415) 555-0111',
      email: 'marcus@vanguardadvisory.com',
      whatsapp: '',
      googleBusinessProfileUrl: 'https://business.google.com/r/vanguard-consulting',
      googleMapsUrl: 'https://maps.app.goo.gl/SFConsultingSample',
      website: 'https://vanguardwealthsf.com',
      socials: {
        facebook: '',
        twitter: 'https://twitter.com/sterling_wealth',
        instagram: '',
        linkedin: 'https://linkedin.com/in/marcussterling-fiduciary',
        youtube: ''
      },
      openingHours: [
        { day: 'Monday', open: '08:30', close: '17:30', closed: false },
        { day: 'Tuesday', open: '08:30', close: '17:30', closed: false },
        { day: 'Wednesday', open: '08:30', close: '17:30', closed: false },
        { day: 'Thursday', open: '08:30', close: '17:30', closed: false },
        { day: 'Friday', open: '08:30', close: '16:00', closed: false },
        { day: 'Saturday', open: '00:00', close: '00:00', closed: true },
        { day: 'Sunday', open: '00:00', close: '00:00', closed: true }
      ],
      products: [],
      services: [
        {
          id: 's1',
          name: 'Comprehensive Retirement Projection Modeling',
          description: 'A mathematical simulation model analyzing tax brackets, inflation-adjusted spending, Social Security harvesting dates, and multi-scenario sequences of returns.',
          price: '$2,200.00',
          category: 'Wealth Strategy'
        },
        {
          id: 's2',
          name: 'Strategic Fiduciary Investment Portfolio Review',
          description: 'Detailed analysis of your existing portfolios, index tracking efficiency, fund expense ratios, asset location optimization, and rebalancing thresholds.',
          price: '$950.00',
          category: 'Diagnostics'
        }
      ],
      faqs: [
        {
          id: 'f1',
          question: 'Are you a fee-only fiduciary advisor?',
          answer: 'Yes, absolutely. We operate on a fee-only basis and are bound by strict fiduciary duty. We never sell products, collect insurance commissions, or receive mutual fund kickbacks. Our compensation comes entirely and transparently from our clients.'
        },
        {
          id: 'f2',
          question: 'Is there a minimum asset requirement to work with you?',
          answer: 'For ongoing comprehensive wealth management, we typically recommend a minimum investable asset tier of $500,000. However, our tactical flat-fee projection models are open to all savers regardless of balance!'
        }
      ],
      images: [
        'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80'
      ],
      logo: '📈',
      coordinates: {
        latitude: '37.7915',
        longitude: '-122.4014'
      },
      canonicalUrl: 'https://vanguardadvisory.com',
      theme: {
        style: 'mono',
        primaryColor: '#000000', // high-contrast black
        secondaryColor: '#e4e4e7', // zinc light border
        bgColor: '#ffffff', // pure stark white
        textColor: '#09090b' // absolute black
      },
      typography: 'mono',
      sectionOrder: DEFAULT_SECTION_ORDER
    }
  },
  blank: {
    label: '⬜ Start from Scratch (Blank Canvas)',
    data: {
      name: '',
      category: '',
      description: '',
      tagline: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      phone: '',
      email: '',
      whatsapp: '',
      googleBusinessProfileUrl: '',
      googleMapsUrl: '',
      website: '',
      socials: {
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: ''
      },
      openingHours: [
        { day: 'Monday', open: '09:00', close: '17:00', closed: false },
        { day: 'Tuesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Wednesday', open: '09:00', close: '17:00', closed: false },
        { day: 'Thursday', open: '09:00', close: '17:00', closed: false },
        { day: 'Friday', open: '09:00', close: '17:00', closed: false },
        { day: 'Saturday', open: '00:00', close: '00:00', closed: true },
        { day: 'Sunday', open: '00:00', close: '00:00', closed: true }
      ],
      products: [],
      services: [],
      faqs: [],
      images: [],
      logo: '🏢',
      coordinates: {
        latitude: '',
        longitude: ''
      },
      canonicalUrl: 'https://my-business.pages.dev',
      theme: {
        style: 'minimal',
        primaryColor: '#4f46e5',
        secondaryColor: '#e0e7ff',
        bgColor: '#fafafa',
        textColor: '#1f2937'
      },
      typography: 'inter',
      sectionOrder: DEFAULT_SECTION_ORDER
    }
  }
};
