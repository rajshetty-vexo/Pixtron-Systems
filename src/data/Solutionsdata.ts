import {
  Package,
  Cable,
  Sparkles,
  TestTube2,
  Pill,
  QrCode,
  ScanLine,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface CaseStudy {
  title: string;
  industry: string;
  challenge: string;
  result: string;
  metric: string;
}

export interface SolutionItem {
  id: string;
  name: string;
  tagline: string;
  desc: string;
  longDesc: string;
  icon: LucideIcon; // <--- Required Field
  images?: string[];
  keyMetrics: { metric: string; value: string }[];
  industriesUsed: string[];
  productsUsed: string[];
  applications: string[];
  caseStudies?: CaseStudy[];
}

export const solutionsData: SolutionItem[] = [
    {
      id: 'tetra-pack-inspection',
      name: 'Tetra Pack Inspection',
      icon: Package, // <-- Fixed: Added Icon
      tagline: 'Complete carton integrity & print verification for aseptic packaging',
      desc: 'High-speed inspection of tetra and carton packs for seal integrity, print quality, fill level, and code verification on fast-moving beverage and dairy lines.',
      images:["https://res.cloudinary.com/owsr7mjw/image/upload/v1788238920/TetraPack_w5ygl1.svg"],
      longDesc:
        'Our Tetra Pack inspection solution combines multi-camera 360° coverage with high-speed code reading and print verification to catch seal defects, mis-registered print, and short-fills before they ever leave the line. Built for the demands of aseptic carton lines, it runs inline without slowing production and feeds every result into a central quality dashboard for full batch traceability.',
      keyMetrics: [
        { metric: 'Line Speed', value:  'Up to 400 packs/min' },
        { metric: 'Seal Defect Detection', value: '>99.5%' },
        { metric: 'Print Registration Accuracy', value: '±0.3mm' },
        { metric: 'False Reject Rate', value: '<0.1%' },
      ],
      industriesUsed: ['Food & Beverage', 'Dairy & Beverages', 'FMCG Packaging'],
      productsUsed: ['inspectra'],
      applications: [
        'Longitudinal & top seal seam inspection',
        'Print registration and colour consistency check',
        'Best-before date and batch code OCR',
        'Fill-level and pack squareness verification',
      ],
    // caseStudies: [
    //   {
    //     title: 'Dairy Carton Line Seal Verification',
    //     industry: 'Dairy & Beverages',
    //     challenge:
    //       'A regional dairy producer was seeing intermittent leaker complaints traced back to inconsistent top-seal seams that manual spot-checks missed at full line speed.',
    //     result:
    //       'Deployed a 360° seal and print inspection gate directly after the filler, catching seam defects and short-fills before palletizing.',
    //     metric: '92% reduction in leaker complaints within the first quarter',
    //   },
    //   {
    //     title: 'Juice Carton Batch Code Compliance',
    //     industry: 'FMCG Packaging',
    //     challenge:
    //       'A juice manufacturer needed 100% verification of best-before dates and batch codes to meet a new retailer traceability mandate.',
    //     result:
    //       'Inline OCR/OCV verification was added at the case-packer infeed, automatically diverting any carton with an unreadable or mismatched code.',
    //     metric: '100% batch code compliance, zero recall events since go-live',
    //   },
    // ],
  },
  {
    id: 'cable-wire-inspection',
    name: 'Cable & Wire Inspection',
    icon: Cable, // <-- Fixed: Added Icon
    tagline: 'Continuous surface, insulation & print inspection for extrusion lines',
    desc: 'Non-stop inline inspection of cable and wire surfaces for scratches, insulation defects, diameter variance, and print/marking quality at extrusion line speeds.',
    images:["https://res.cloudinary.com/owsr7mjw/image/upload/v1788246198/Cabel-wire_rgctee.svg"],
    longDesc:
      'Purpose-built for continuous-flow production, this solution keeps the line running while a high-speed camera tunnel scans every meter of cable or wire that passes through. Surface scratches, insulation gaps, out-of-tolerance diameter, and missing or smudged print are flagged instantly, with automatic line-stop and alarm on critical defects so operators can react before a fault propagates down the reel.',
    keyMetrics: [
      { metric: 'Line Speed', value: 'Up to 220 m/min' },
      { metric: 'Diameter Tolerance', value: '±0.02mm' },
      { metric: 'Defect Classes Detected', value: '4 (scratch, insulation, diameter, print)' },
      { metric: 'Camera Coverage', value: '360° tunnel' },
    ],
    industriesUsed: ['Electronics', 'Automotive', 'Manufacturing', 'Cable & Wire Manufacturing'],
    productsUsed: ['rapid', 'opus'],
    applications: [
      'Continuous surface scratch, tear & smudge detection',
      'Insulation gap and seal integrity monitoring',
      'Real-time diameter and roundness tolerance checks',
      'Cable print/marking legibility verification',
    ],
    // caseStudies: [
    //   {
    //     title: 'Automotive Wiring Harness Extrusion',
    //     industry: 'Automotive',
    //     challenge:
    //       'Insulation micro-tears on a high-speed extrusion line were only discovered during downstream harness assembly, causing costly rework.',
    //     result:
    //       'An inline tunnel inspection system was fitted directly after the cooling trough, automatically stopping the line and logging the exact meter position of any defect.',
    //     metric: '68% drop in downstream rework tickets',
    //   },
    //   {
    //     title: 'Solar Cable Diameter Control',
    //     industry: 'Manufacturing',
    //     challenge:
    //       'A solar cable manufacturer needed tighter diameter control to meet a new export specification without slowing throughput.',
    //     result:
    //       'Continuous diameter and roundness monitoring was added with live SPC charting, letting operators correct extruder settings in real time.',
    //     metric: 'Diameter variance cut from ±0.06mm to ±0.02mm',
    //   },
    // ],
  },
  {
    id: 'reflective-material-inspection',
    name: 'Reflective Material Inspection',
    icon: Sparkles, // <-- Fixed: Added Icon
    tagline: 'Glare-resistant defect detection on metal, foil & laminate surfaces',
    desc: 'Specialized lighting and multi-angle capture for inspecting highly reflective metal, foil, and laminate surfaces where standard cameras are blinded by glare.',
    images:["https://res.cloudinary.com/owsr7mjw/image/upload/v1788244454/Reflective_Material_u4rkjd.svg"],
    longDesc:
      'Reflective and specular surfaces are notoriously difficult for standard machine vision — direct light bounces straight back into the lens and hides real defects. This solution uses structured, diffuse and multi-angle lighting together with our geometry & colour engine to cut through glare and reliably surface scratches, dents, and finish inconsistencies on metal, foil, and laminated materials.',
    keyMetrics: [
      { metric: 'Minimum Defect Size', value: '0.05mm' },
      { metric: 'Glare Suppression', value: 'Multi-angle diffuse lighting' },
      { metric: 'Surface Types Supported', value: 'Metal, foil, laminate, glass' },
      { metric: 'Inspection Cycle Time', value: '<0.4s' },
    ],
    industriesUsed: ['Automotive', 'Electronics', 'Manufacturing', 'Packaging'],
    productsUsed: ['opus'],
    applications: [
      'Metal panel scratch, dent & oxidation detection',
      'Foil and laminate wrinkle and pinhole inspection',
      'Reflective label and foil-stamp verification',
      'Brushed and polished finish consistency checks',
    ],
    // caseStudies: [
    //   {
    //     title: 'Metal Stamping Surface Finish QC',
    //     industry: 'Automotive',
    //     challenge:
    //       "Standard cameras on a metal stamping line were washing out under the part's mirror finish, missing shallow surface dents.",
    //     result:
    //       'Multi-angle diffuse lighting combined with a geometry & colour camera revealed dents as shallow as 0.05mm that were previously invisible to vision systems.',
    //     metric: 'Escape rate for surface defects reduced by 81%',
    //   },
    //   {
    //     title: 'Foil Laminate Pinhole Detection',
    //     industry: 'Packaging',
    //     challenge:
    //       "A flexible packaging converter needed to catch pinholes in foil laminate that standard backlighting couldn't distinguish from surface glare.",
    //     result:
    //       'A structured-light inspection cell was integrated post-lamination, isolating true pinholes from reflective noise in real time.',
    //     metric: 'Pinhole escapes to customer reduced to near zero',
    //   },
    // ],
  },
  {
    id: 'vial-counting-inspection',
    name: 'Vial Counting Inspection',
    icon: TestTube2, // <-- Fixed: Added Icon
    tagline: 'Top-Side Presence, Count & Orientation Verification for Vials & Ampoules',
    desc: 'Overhead camera verification that every tray, tub, or nest contains the correct count of vials or ampoules, correctly oriented, before secondary packaging.',
    images: ["https://res.cloudinary.com/owsr7mjw/image/upload/v1788244454/Vial-Inspection_jnyuej.svg"],
    longDesc:
      'Short-fills and misplaced vials in secondary packaging are a serious compliance risk in pharma manufacturing. This solution uses a high-resolution overhead camera to verify vial or ampoule count, presence, and orientation in trays, tubs, and nests at the point of packing, rejecting any carrier that doesn’t match the expected configuration before it moves downstream.',
    keyMetrics: [
      { metric: 'Counting Accuracy', value: '100%' },
      { metric: 'Processing Speed', value: '<20 ms per image' },
      { metric: 'Orientation Detection', value: 'Upright / inverted / tilted' },
      { metric: 'False Reject Rate', value: '<0.05%' },
    ],
    industriesUsed: ['Pharmaceuticals', 'Healthcare'],
    productsUsed: ['opus'],
    applications: [
      'Full-tray and nest vial count verification',
      'Missing or broken vial/ampoule detection',
      'Cap and stopper presence confirmation',
      'Orientation and seating verification in nests',
    ],
    // caseStudies: [
    //   {
    //     title: 'Vaccine Vial Nest Verification',
    //     industry: 'Pharmaceuticals',
    //     challenge:
    //       'A vaccine fill-finish line needed 100% verification of vial count and seating in nests before automated lyophilization, with zero tolerance for short-fills.',
    //     result:
    //       'A 360° counting station was installed pre-lyophilizer, verifying every nest position and automatically diverting incomplete trays.',
    //     metric: 'Zero short-fill escapes across 18 months of production',
    //   },
    //   {
    //     title: 'Ampoule Tub Count for Export Batches',
    //     industry: 'Healthcare',
    //     challenge:
    //       'Manual tub counting before export packing was inconsistent and slowed the secondary packaging line.',
    //     result:
    //       'Automated 360° counting replaced manual checks entirely at the tub in-feed, with results logged directly to the batch record.',
    //     metric: 'Secondary packing throughput increased by 35%',
    //   },
    // ],
  },
  
{
  id: 'blister-inspection',
  name: 'Blister Inspection',
  icon: Pill,
  tagline: 'Cavity-level tablet & seal integrity verification for blister lines',
  desc: 'High-speed vision inspection for blister packaging lines, detecting missing, broken, or discoloured tablets, foil seal defects, and foil print/batch text errors at every cavity.',
  images: ["https://res.cloudinary.com/owsr7mjw/image/upload/v1788245596/Blister_Inspection_vki7my.svg"],
  longDesc:
    'Every cavity, every blister, every cycle this solution inspects blister packs immediately after sealing to catch missing, broken, chipped, or wrong-colour tablets alongside foil seal defects like pinholes and wrinkles. It also verifies the foil print batch number, manufacturing and expiry dates through inline OCR/OCV, ensuring every printed detail matches the batch record before the pack leaves the line. Multi-row, multi-cavity layouts are analysed simultaneously so inspection keeps pace with even the fastest blister lines.',
  keyMetrics: [
    { metric: 'Inspection Rate', value: '800 blisters/min' },
    { metric: 'Cavity Detection Accuracy', value: '99.9%' },
    { metric: 'Seal Defect Sensitivity', value: 'Pinhole & wrinkle level' },
    { metric: 'False Reject Rate', value: '<0.05%' },
  ],
  industriesUsed: ['Pharmaceuticals', 'Nutraceuticals'],
  productsUsed: ['opus'],
  applications: [
    'Missing, broken & chipped tablet/capsule detection',
    'Wrong-colour and cross-contamination check',
    'Foil seal pinhole and wrinkle inspection',
    'Foil print & batch/expiry text verification (OCR/OCV)',
    'Multi-row, multi-cavity simultaneous analysis',
  
    ],
    // caseStudies: [
    //   {
    //     title: 'Multi-Cavity Tablet Verification',
    //     industry: 'Pharmaceuticals',
    //     challenge:
    //       "A generics manufacturer's 20-cavity blister line had no automated way to catch broken tablets across every row at full speed.",
    //     result:
    //       'A cavity-level vision gate was added directly after the sealing station, inspecting all cavities across every row on every cycle.',
    //     metric: 'Cavity-level defect escapes reduced to <0.02%',
    //   },
    //   {
    //     title: 'Foil Seal Integrity for Export Compliance',
    //     industry: 'Nutraceuticals',
    //     challenge:
    //       'A nutraceutical exporter faced returns from micro-leaks in blister foil seals that passed manual visual checks.',
    //     result:
    //       'Automated pinhole and wrinkle detection was added post-seal, flagging seal defects invisible to the naked eye.',
    //     metric: 'Export return rate dropped by 74%',
    //   },
    // ],
  },
  {
    id: '1d-2d-code-pharma-ocr-inspection',
    name: '1D/2D Code, Pharma Code & OCR Inspection',
    icon: QrCode, // <-- Fixed: Added Icon
    tagline: 'Ultra-fast code reading and text verification across pack formats',
    desc: 'Reads and verifies 1D barcodes, 2D codes, and pharma codes alongside OCR/OCV of batch, lot, and expiry text — all inline, at full production speed.',
    images: ["https://res.cloudinary.com/owsr7mjw/image/upload/v1788247147/Pharma-Code_and_OCR_u7zkws.svg"],
    longDesc:
      'From cartons to blister foils to shipping labels, this solution combines high-speed 1D/2D code decoding with OCR/OCV of variable print — batch numbers, lot codes, expiry dates — in a single inspection pass. Damaged, low-contrast, or partially printed codes are still reliably decoded, and every result is matched against expected values for full track-and-trace compliance.',
    keyMetrics: [
      { metric: 'Code Read Rate', value: '>99.9%' },
      { metric: 'OCR Accuracy', value: '99.99%' },
      { metric: 'Code Types Supported', value: '1D, 2D, Pharmacode' },
      { metric: 'Inspection Speed', value: 'Up to 1,200 units/min' },
    ],
    industriesUsed: ['Pharmaceuticals', 'Logistics', 'FMCG Packaging'],
    productsUsed: ['CodexQ', 'inspectra'],
    applications: [
      'Pharmacode and linear barcode decoding',
      'QR and 2D matrix code verification',
      'Batch, lot & expiry date OCR/OCV',
       'Human-readable text verification alongside barcode data',
      'Damaged or low-contrast code recovery',
    ],
    // caseStudies: [
    //   {
    //     title: 'Pharmacode Verification on Carton Line',
    //     industry: 'Pharmaceuticals',
    //     challenge:
    //       'A packaging line had no automated check that pharmacode print matched the batch record, relying on periodic manual sampling.',
    //     result:
    //       '100% inline pharmacode and OCR verification was added at the carton outfeed, cross-checking every code against the batch record in real time.',
    //     metric: 'Moved from sample-based to 100% verified output',
    //   },
    //   {
    //     title: 'Shipping Label Read-Rate Improvement',
    //     industry: 'Logistics',
    //     challenge:
    //       'A distribution centre was seeing a high manual-intervention rate on damaged or skewed shipping labels at the sortation gate.',
    //     result:
    //       'Omnidirectional 1D/2D reading with damaged-code recovery was deployed at the induction point, cutting manual re-scans significantly.',
    //     metric: 'Manual intervention rate reduced by 63%',
    //   },
    // ],
  },
  {
    id: 'datamatrix-ocr-verification',
    name: 'Datamatrix & OCR Verification',
    icon: ScanLine, // <-- Fixed: Added Icon
    tagline: 'Serialization-grade DataMatrix decoding for global track-and-trace',
    desc: 'High-density DataMatrix decoding paired with OCR/OCV, built for serialization workflows and regulatory track-and-trace compliance.',
    images: ["https://res.cloudinary.com/owsr7mjw/image/upload/v1788339326/Datametrics_pxykvg.jpg"],
    longDesc:
      'Built specifically for serialization-grade traceability, this solution decodes high-density GS1 DataMatrix codes — including damaged, low-contrast, or laser-etched marks — and cross-verifies the encoded serial number, batch, and expiry against printed OCR text and the serialization database. It’s designed to meet the accuracy demands of global track-and-trace mandates without adding a bottleneck to the line.',
    keyMetrics: [
      { metric: 'DataMatrix Read Rate', value: '>99.95%' },
      { metric: 'Serialization Compliance', value: 'GS1 DataMatrix / DSCSA / FMD' },
      { metric: 'OCR Cross-Verification', value: 'Serial, batch & expiry' },
      { metric: 'Damaged Code Recovery', value: 'Up to 30% obscured' },
    ],
    industriesUsed: ['Pharmaceuticals', 'Electronics', 'Automotive'],
    productsUsed: ['CodexQ', 'inspectra'],
    applications: [
      'GS1 DataMatrix serialization decoding',
      'Serial number, batch & expiry cross-verification',
      'Laser-etched and dot-peen DataMatrix reading',
      'Aggregation and parent-child serialization checks',
    ],
    // caseStudies: [
    //   {
    //     title: 'DSCSA Serialization Line Upgrade',
    //     industry: 'Pharmaceuticals',
    //     challenge:
    //       'A contract manufacturer needed to upgrade an existing line to meet DSCSA serialization requirements without a full line rebuild.',
    //     result:
    //       'A DataMatrix decode-and-verify station was retrofitted at the existing camera mount point, cross-checking every code against the serialization system.',
    //     metric: 'Fully compliant go-live in under 6 weeks',
    //   },
    //   {
    //     title: 'Laser-Etched DataMatrix on Metal Components',
    //     industry: 'Automotive',
    //     challenge:
    //       'Laser-etched DataMatrix codes on engine components were inconsistently readable due to low contrast against the metal surface.',
    //     result:
    //       'Directional lighting tuned for laser-etch contrast was combined with damaged-code recovery to reliably decode marks other readers missed.',
    //     metric: 'Read rate improved from 91% to 99.6%',
    //   },
    // ],
  },
];

export const solutionIcons = {
  Package,
  Cable,
  Sparkles,
  TestTube2,
  Pill,
  QrCode,
  ScanLine,
};