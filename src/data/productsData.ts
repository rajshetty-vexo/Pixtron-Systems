
export interface ProductEdition {
  eco: {
    title: string;
    description: string;
    features: string[];
  };
  pro: {
    title: string;
    description: string;
    features: string[];
  };
  evo: {
    title: string;
    description: string;
    features: string[];
  };
}

export interface ProductDetail {
  id: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  brochureUrl: string;
  images?: string[];
  videoUrl?: string; // Replace with actual video source path (.mp4) or embed
  mainFeatures: {
    title: string;
    description: string;
  }[];
  industriesUsed: string[];
  specifications?: { label: string; value: string }[];
  editions?: ProductEdition;
}

export const productsData: ProductDetail[] = [
  {
    id: 'inspectra',
    name: 'Inspectra',
    category: 'Dot Print Inspection',
    subtitle: 'Next-Generation High-Speed Optical Inspection Engine',
    description:
      'High precision, ultra high-speed dot print inspection designed for complex packaging lines. Inspectra ensures 100% real-time defect verification without slowing production speeds.',
    brochureUrl: 'https://drive.google.com/uc?export=download&id=15rL6vPZ1yqXhQxEk5ynmleaBDscnEHwy',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-manufacturing-41525-large.mp4', // Demo video link
    mainFeatures: [
      {
        title: 'OCR & OCV Intelligence',
        description: 'Advanced character recognition for batch numbers, expiry dates, and variable barcode matrix verification.',
      },
      {
        title: 'Dot Print & Seal Integrity Verification',
        description: 'Micron-level detection for print smudginess, missing dots, seal gaps, and micro-tears.',
      },
      {
        title: 'Inline High-Speed Processing',
        description: 'Capable of handling ultra-fast conveyor feeds up to 2500 FPS with instant rejection trigger.',
      },
    ],
    industriesUsed: [
      'Pharmaceutical & Healthcare Packaging',
      'Food & Beverage Bottling Lines',
      'FMCG High-Speed Assembly',
      'Automotive Component Marking',
    ],
    editions: {
      eco: {
        title: 'Basic Presence Check',
        description: 'Standard optical check for basic presence/absence & binary thresholding.',
        features: [
          'Presence / Absence verification',
          'Basic thresholding & contrast checks',
          'Standard PASS / FAIL output signals',
        ],
      },
      pro: {
        title: 'High Precision & Deep Inspection',
        description: 'Micron-level defect detection for micro-scratches, complex contours & OCR.',
        features: [
          'Advanced OCR & OCV character reading',
          'Micro-scratch & surface defect analysis',
          'Complex shape & depth profile checking',
        ],
      },
      evo: {
        title: 'Custom Evolutionary Mode',
        description: 'Client-tailored logic for custom logo matching, custom scripts & dynamic rules.',
        features: [
          'Custom logo presence & alignment check',
          'Tailored software logic & API integration',
          'Dynamic recipe & rule customization',
        ],
      },
    },

  },


  {
    id: 'rapid',
    name: 'Rapid',
    category: 'Continuous Flow Production Line Inspection',
    subtitle: 'Continuous Flow Optical Quality Assurance',
    description:
      'Fast, accurate inspection with OCR/OCV for continuous flow production lines, with real-time monitoring and inspection of surface defects and dimensions.',
    brochureUrl: '/brochures/rapid-spec-sheet.pdf',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-robotic-arm-working-in-a-factory-41523-large.mp4',
    mainFeatures: [
      {
        title: 'Continuous Profile Tracking',
        description: 'Real-time surface contouring and profile scanning for defects during non-stop extrusion or web feeds.',
      },
      {
        title: 'Micron-Level Defect Detection',
        description: 'Sub-pixel accuracy algorithms that pick up minute scratches, dents, and color variations.',
      },
      {
        title: 'Live Alarms & Analytics',
        description: 'Instant reject signals paired with dashboard analytics to detect recurring tooling errors.',
      },
    ],
    industriesUsed: [
      'Extrusion & Cable Manufacturing',
      'Metal & Sheet Inspection',
      'Textile & Paper Rolls',
    ],
    editions: {
    eco: {
      title: 'Basic Line & Edge Tracking',
      description: 'Continuous web presence, edge alignment, and basic thresholding for extrusion/flow lines.',
      features: [
        'Web edge & alignment tracking',
        'Basic surface presence & break checks',
        'Standard PASS / FAIL line output',
      ],
    },
    pro: {
      title: 'High Precision Surface & Dimension Inspection',
      description: 'Micron-level continuous profile scanning for micro-scratches, dents, and color variations.',
      features: [
        'Continuous profile & dimension scanning',
        'Micro-scratch, dent & tear detection',
        'Sub-pixel surface defect measurement',
      ],
    },
    evo: {
      title: 'Custom Line Integration Mode',
      description: 'Customized software logic for client-specific line speeds, PLC signals, and print logo checks.',
      features: [
        'Custom logo & print mark verification',
        'Tailored PLC & hardware sync logic',
        'Dynamic recipe setup for custom web widths',
      ],
    },
  },
  },



  {
    id: 'CodexQ',
    name: 'CodexQ',
    category: 'Code Reading & OCR',
    subtitle: 'Ultra-Fast Traceability & Code Verification',
    description:
      'Ultra-fast reading and OCR-based verification of 1D/2D codes, including pharma-grade traceability labels.',
    brochureUrl: '/brochures/CodexQ-spec-sheet.pdf',
    mainFeatures: [
      {
        title: '1D & 2D Array Decoding',
        description: 'Decodes QR codes, DataMatrix, and damaged barcodes effortlessly.',
      },
      {
        title: 'Pharma Traceability Compliance',
        description: 'Ensures strict compliance with GS1 and global track-and-trace mandates.',
      },
      {
    title: "High-Speed Industrial Processing",
    description: "Captures and decodes high-density codes on fast-moving conveyor lines without frame loss."
  },
    ],
    industriesUsed: [
      'Pharmaceutical Supply Chain',
      'Logistics & Warehousing',
    ],
    editions: {
    eco: {
      title: 'Standard Barcode Reader',
      description: 'Reliable 1D/2D code decoding for standard production lines.',
      features: [
        '1D & 2D Barcode Decoding (QR, DataMatrix)',
        'Basic Batch Code & Expiry Reading',
        'Up to 300 Decodes/Min Line Speed',
        'Standard CSV Log Export'
      ]
    },
    pro: {
      title: 'High-Speed OCR & Traceability',
      description: 'Pharma-compliant, high-density code reading with deep OCR verification.',
      features: [
        'GS1 & Pharma Traceability Compliance',
        'Advanced OCR/OCV Character Verification',
        'Damaged & Low-Contrast Code Recovery',
        'High-Speed Line Processing (1000+ PPM)',
        'Real-time Audit Trail & ERP Integration'
      ]
    },
    evo: {
      title: 'Custom Multi-Camera System',
      description: 'Tailored vision array for multi-side scanning and custom label workflows.',
      features: [
        'Multi-Camera 360° Code Reading',
        'Custom OCR Font Training & Validation',
        'PLC & Robotic Reject System Triggering',
        'Tailored Industrial API & Database Sync'
      ]
    }
  },
      
  },

  {
    id: 'opus',
    name: 'Opus',
    category: 'Geometry & Color Inspection',
    subtitle: 'Precise Shape, Size, and Color Verification',
    description:
      'Precise shape, size, and color consistency verification for complex manufacturing components.',
    brochureUrl: '/brochures/opus-spec-sheet.pdf',
    mainFeatures: [
      {
        title: 'Dimensional Tolerance Checks',
        description: 'Measures angles, lengths, and diameters down to millimeter fractions.',
      },
      {
        title: 'Spectrum Color Matching',
        description: 'Identifies faint color mismatches across batches under standardized light conditions.',
      },
      {
    title: "Surface Defect Inspection",
    description: "Detects micro-scratches, cracks, dents, and surface irregularities in real-time."
      },
    ],
    industriesUsed: [
      'Automotive Parts',
      'Electronics Assembly',
    ],
    editions: {
    eco: {
      title: 'Standard Geometry Check',
      description: 'Basic dimensional measurement and color verification for standard assembly lines.',
      features: [
        '2D Shape & Edge Measurement',
        'Basic Delta-E Color Matching',
        'Standard Angle, Length & Diameter Checks',
        'Pass/Fail Signal Output via GPIO'
      ]
    },
    pro: {
      title: 'High-Precision Color & Surface',
      description: 'Micron-level dimensional checks with deep spectrum color matching and defect analysis.',
      features: [
        'Sub-Millimeter Fractional Tolerance Inspection',
        'Advanced Multi-Spectral Color Matching',
        'Real-Time Surface Scratch & Dent Detection',
        'High-Speed Line Synchronization',
        'Detailed Analytics & Defect Heatmaps'
      ]
    },
    evo: {
      title: 'Custom Multi-Axis Vision',
      description: 'Tailored 3D geometry array with custom lighting and robotic sorting integration.',
      features: [
        'Multi-Camera 3D Geometric Verification',
        'Custom Illumination & Spectrum Tuning',
        'PLC & Robotic Reject System Integration',
        'Tailored Quality Control API & Enterprise Logging'
      ]
    }
  },
  },


  {
    id: 'panorama',
    name: 'Panorama',
    category: '360 Degree Inspection',
    subtitle: 'Complete Surface Vision Array',
    description:
      'Complete cylindrical surface inspection using multi-camera arrays for bottles, cans, and tubes.',
    brochureUrl: '/brochures/panorama-spec-sheet.pdf',
    mainFeatures: [
      {
        title: '360° Seamless Coverage',
        description: 'Zero blind spot coverage using multi-lens array synchronization.',
      },
      {
        title: 'Cap & Label Alignment',
        description: 'Verifies seal crimping, ring integrity, and precise label placement.',
      },
      {
        title: "Panoramic Image Unwrapping",
        description: "Stitches multi-camera angles into a flattened, single high-resolution panoramic view."
     },
    ],
    industriesUsed: [
      'Beverages & Distilleries',
      'Cosmetics & Tubes',
    ], 
    editions: {
    eco: {
      title: 'Standard 360° Surface Check',
      description: 'Basic full-circumference inspection for bottle labeling and cap presence.',
      features: [
        'Multi-Lens 360° Cylindrical Coverage',
        'Basic Cap Presence & Ring Integrity Check',
        'Label Position & Skew Verification',
        'Standard Pass/Fail Reject Signal'
      ]
    },
    pro: {
      title: 'Advanced Panoramic Unwrapping',
      description: 'Zero blind-spot inspection with real-time image unwrapping and high-speed defect tracking.',
      features: [
        'Real-Time Panoramic Image Unwrapping',
        'Micro-Crack & Dent Detection on Bottles/Cans',
        'Precision Cap Crimping & Seal Integrity Analysis',
        'High-Speed Conveyor Line Processing (600+ BPM)',
        'Defect Classification & Statistical Analytics'
      ]
    },
    evo: {
      title: 'Custom Multi-Array System',
      description: 'Tailored multi-camera rig for complex container geometries and specialized line setups.',
      features: [
        'Custom Lens & Lighting Array Configuration',
        'Multi-Size Container Auto-Switching Support',
        'High-Speed Pneumatic Rejecter Synchronization',
        'Tailored Factory Automation & PLC Integration'
      ]
    }
  },
  },


  // {
  // id: 'blister-inspection-system',
  // name: 'Blister Inspection System',
  // category: 'Blister Packaging Inspection',
  // subtitle: 'Advanced Vision Quality Control',
  // description:
  //   'High-speed, real-time vision inspection designed for pharmaceutical blister lines to detect missing tablets, damaged products, color variations, and seal defects.',
  // brochureUrl: '/brochures/blister-inspection-spec-sheet.pdf',
  // mainFeatures: [
  //   {
  //     title: 'Cavity & Product Integrity Verification',
  //     description: 'Detects broken, chipped, wrong-color, or missing tablets and capsules in real time.',
  //   },
  //   {
  //     title: 'Seal & Foil Quality Inspection',
  //     description: 'Identifies pinholes, foil wrinkles, sealing defects, and foreign particle contamination.',
  //   },
  //   {
  //   title: "High-Speed Multi-Cavity Analysis",
  //   description: "Inspects complex multi-row cavity layouts simultaneously on ultra-fast packaging lines."
  // },
  // ],
  // industriesUsed: [
  //   'Pharmaceutical & Healthcare Packaging',
  //   'Nutraceutical Manufacturing',
  // ],
  //   images: [
  // "https://res.cloudinary.com/owsr7mjw/image/upload/v1786684289/blister1_dczcxv.jpg",
  // "https://res.cloudinary.com/owsr7mjw/image/upload/v1786684289/blister2_euuz5n.jpg",
  // "https://res.cloudinary.com/owsr7mjw/image/upload/v1786684289/blister3_zittfi.jpg",
  // "https://res.cloudinary.com/owsr7mjw/image/upload/v1786684289/blister4_znj1o5.jpg",
  //   ]
  // },
];