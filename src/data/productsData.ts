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
    images: [
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786173277/65911_hprlxx.png",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786173277/65912_eedjvz.png",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786173277/65914_h9iilf.png",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786173277/65915_vhadsf.png",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786173277/65919_e7qbaq.png",  
],
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
    images: [
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786723312/rapid_1_shtsln.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786723312/rapid_2_snlkky.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786723313/rapid_3_x0hy0g.jpg",
],
  },
  {
    id: 'codex',
    name: 'Codex',
    category: 'Code Reading & OCR',
    subtitle: 'Ultra-Fast Traceability & Code Verification',
    description:
      'Ultra-fast reading and OCR-based verification of 1D/2D codes, including pharma-grade traceability labels.',
    brochureUrl: '/brochures/codex-spec-sheet.pdf',
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
        images: [
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786182619/WhatsApp_Image_2026-08-08_at_2.21.46_PM_jxfsid.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786183439/IMG_20260808_145650_svpjus.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786182619/WhatsApp_Image_2026-08-08_at_2.32.20_PM_paqjbw.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786182619/WhatsApp_Image_2026-08-08_at_2.35.38_PM_you4bs.jpg",  
],
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
  images: [
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786629596/Opus1_lt5q51.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786629596/opus2_tip7ou.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786629596/opus3_vci5vx.jpg", 
],
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
       images: [
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786690931/panaroma1_si3be5.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786690931/panaroma2_cnzmhy.jpg",
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786690931/panaroma3_pedrvo.jpg", 
  "https://res.cloudinary.com/owsr7mjw/image/upload/v1786723312/panaroma_4_gs1lsn.jpg",
    ],
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