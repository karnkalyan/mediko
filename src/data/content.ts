// ============================================================
// Mediko Bazaar — Hero Slides, Services, Training, Blog, Testimonials
// ============================================================
import type { HeroSlide, ServiceItem, TrainingCourse, BlogPost, Testimonial, Engineer, Seller } from '../types'

// Hero slider data — uses images from /slider/ directory
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: 'Your One-Stop Solution for Medical Equipment',
    highlightText: 'and Services',
    description: 'Buy, rent, maintain and source trusted medical equipment for hospitals, clinics and home care across Nepal.',
    primaryBtn: { label: 'Explore Products', page: 'shop' },
    secondaryBtn: { label: 'Request a Quote', page: 'request-quote' },
    image: '/slider/8417dff5-f8a5-4bb3-8f3a-b9e0d319f5ad.png',
    trustPoints: [
      { icon: 'check', text: '100% Genuine Products' },
      { icon: 'shield', text: 'Verified Sellers & Warranty' },
      { icon: 'truck', text: 'Fast Delivery Across Nepal' },
    ],
  },
  {
    id: 2,
    title: 'Reliable Medical Equipment',
    highlightText: 'Supply Service',
    description: 'End-to-end sourcing, procurement and institutional supply for hospitals, clinics, laboratories and healthcare projects.',
    primaryBtn: { label: 'Explore Supply Services', page: 'supply-service' },
    secondaryBtn: { label: 'Send Supply Enquiry', page: 'b2b-enquiry' },
    image: '/slider/6763f461-253f-42d5-98ab-1f461ff771b1.png',
    trustPoints: [
      { icon: 'package', text: 'Bulk Orders' },
      { icon: 'search', text: 'Trusted Sourcing' },
      { icon: 'truck', text: 'On-Time Delivery' },
    ],
  },
  {
    id: 3,
    title: 'Professional Engineering',
    highlightText: 'Service & Maintenance',
    description: 'Installation, preventive maintenance, calibration, repair and technical support by qualified medical equipment engineers.',
    primaryBtn: { label: 'Book an Engineer', page: 'engineering-service' },
    secondaryBtn: { label: 'Request Service', page: 'engineering-service' },
    image: '/slider/02ec2435-f600-4b9f-a30e-d997cec40fb2.png',
    trustPoints: [
      { icon: 'award', text: 'Certified Engineers' },
      { icon: 'shield', text: 'Preventive Care' },
      { icon: 'clock', text: '24/7 Support' },
    ],
  },
  {
    id: 4,
    title: 'Trusted Medical Equipment',
    highlightText: 'Rental Solutions',
    description: 'Affordable short-term and long-term rental plans with delivery, installation, support and return management.',
    primaryBtn: { label: 'Browse Rental Products', page: 'rental-products' },
    secondaryBtn: { label: 'Request Rental Quote', page: 'request-quote' },
    image: '/slider/2cefb91f-e019-4762-817b-8395e26261d4.png',
    trustPoints: [
      { icon: 'truck', text: 'Fast Delivery' },
      { icon: 'headphones', text: 'Expert Support' },
      { icon: 'sparkles', text: 'Best Value' },
    ],
  },
  {
    id: 5,
    title: 'Hospital & Clinic',
    highlightText: 'Setup Support',
    description: 'Complete equipment solutions for new healthcare facilities and upgrades — from planning to installation.',
    primaryBtn: { label: 'Start Your Setup', page: 'supply-service' },
    secondaryBtn: { label: 'Consult Our Team', page: 'contact' },
    image: '/slider/689abece-5965-498d-b4cf-adf3d313c234.png',
    trustPoints: [
      { icon: 'layers', text: 'Turnkey Solutions' },
      { icon: 'clipboard', text: 'Expert Planning' },
      { icon: 'check', text: 'Reliable Supply' },
    ],
  },
]

// Service items
export const SERVICES: ServiceItem[] = [
  { id: 1, title: 'Supply Service', category: 'Supply', description: 'Reliable supply of medical equipment and consumables for hospitals, clinics and healthcare institutions.', icon: 'package', features: ['Bulk & institutional supply', 'Product sourcing', 'Procurement support', 'Delivery & logistics'], price: undefined },
  { id: 2, title: 'Engineering Service', category: 'Engineering', description: 'Professional installation, maintenance, repair and calibration by certified biomedical engineers.', icon: 'wrench', features: ['Installation', 'Preventive maintenance', 'Repair & calibration', 'AMC contracts'], price: undefined },
  { id: 3, title: 'Training & Certification', category: 'Training', description: 'Practical medical equipment operation, safety and maintenance training for healthcare professionals.', icon: 'book-open', features: ['Equipment operation', 'Safety training', 'Maintenance courses', 'Certification'], price: undefined },
  { id: 4, title: 'Equipment for Home', category: 'Home Care', description: 'Medical devices and equipment for home care — oxygen concentrators, hospital beds, wheelchairs and more.', icon: 'home', features: ['Home delivery', 'Setup assistance', 'Usage guidance', 'After-sales support'], price: undefined },
  { id: 5, title: 'Rental Products', category: 'Rental', description: 'Short-term and long-term rental of medical equipment with flexible plans and comprehensive support.', icon: 'clock', features: ['Flexible duration', 'Delivery & pickup', 'Maintenance included', 'Easy extension'], price: undefined },
  { id: 6, title: 'Used Products', category: 'Used Equipment', description: 'Verified and inspected pre-owned medical equipment with quality assurance and warranty.', icon: 'shield-check', features: ['Verified sellers', 'Inspection reports', 'Condition grading', 'Warranty offered'], price: undefined },
  { id: 7, title: 'Spare Parts', category: 'Spare Parts', description: 'Genuine and compatible spare parts for all major medical equipment brands.', icon: 'cog', features: ['OEM & compatible', 'All major brands', 'Quick delivery', 'Technical support'], price: undefined },
]

// Engineering service types
export const ENGINEERING_SERVICES = [
  { title: 'Installation', desc: 'Professional installation and commissioning of medical equipment', icon: 'wrench' },
  { title: 'Preventive Maintenance', desc: 'Scheduled maintenance to prevent equipment failures', icon: 'shield' },
  { title: 'Repair', desc: 'Expert repair services for all types of medical equipment', icon: 'tool' },
  { title: 'Calibration', desc: 'Precision calibration to ensure accurate measurements', icon: 'activity' },
  { title: 'Inspection', desc: 'Comprehensive equipment inspection and reporting', icon: 'clipboard-check' },
  { title: 'AMC', desc: 'Annual maintenance contracts for worry-free equipment management', icon: 'file-text' },
  { title: 'Equipment Relocation', desc: 'Safe relocation and reinstallation of medical equipment', icon: 'truck' },
  { title: 'Technical Consultation', desc: 'Expert technical advice for equipment selection and planning', icon: 'lightbulb' },
  { title: 'Emergency Support', desc: '24/7 emergency technical support for critical equipment', icon: 'alert-circle' },
]

// Training courses
export const TRAINING_COURSES: TrainingCourse[] = [
  { id: 1, title: 'Patient Monitor Operation & Safety', equipmentCategory: 'Patient Monitoring', brand: 'Multi-brand', trainer: 'Er. Bikash Tamang', trainerTitle: 'Senior Biomedical Engineer', duration: '2 Days', location: 'Kathmandu', mode: 'Onsite', startDate: '2026-09-15', endDate: '2026-09-16', seats: 25, seatsAvailable: 12, price: 5000, description: 'Learn to operate, troubleshoot and maintain patient monitoring systems.', topics: ['Monitor setup', 'Parameter interpretation', 'Alarm management', 'Basic troubleshooting', 'Safety protocols'], certification: true, certificateValidity: '2 Years', status: 'Upcoming' },
  { id: 2, title: 'Ventilator Management for Technicians', equipmentCategory: 'Respiratory Care', brand: 'Dräger / Mindray', trainer: 'Er. Suman Adhikari', trainerTitle: 'Clinical Engineer', duration: '3 Days', location: 'Kathmandu', mode: 'Onsite', startDate: '2026-09-22', endDate: '2026-09-24', seats: 20, seatsAvailable: 8, price: 8000, description: 'Comprehensive ventilator management training for biomedical technicians.', topics: ['Ventilator modes', 'Circuit setup', 'Calibration', 'Preventive maintenance', 'Emergency procedures'], certification: true, certificateValidity: '2 Years', status: 'Upcoming' },
  { id: 3, title: 'ECG Machine Operation & Interpretation', equipmentCategory: 'Diagnostic Equipment', trainer: 'Dr. Priya Shrestha', trainerTitle: 'Cardiologist & Trainer', duration: '1 Day', location: 'Online', mode: 'Online', startDate: '2026-10-01', endDate: '2026-10-01', seats: 50, seatsAvailable: 32, price: 3000, description: 'Learn ECG machine operation and basic waveform interpretation.', topics: ['ECG basics', 'Lead placement', 'Machine operation', 'Artifact management', 'Basic interpretation'], certification: true, certificateValidity: '1 Year', status: 'Upcoming' },
  { id: 4, title: 'Oxygen Concentrator Maintenance', equipmentCategory: 'Respiratory Care', brand: 'Yuwell / Philips', trainer: 'Er. Bikash Tamang', trainerTitle: 'Senior Biomedical Engineer', duration: '1 Day', location: 'Kathmandu', mode: 'Onsite', startDate: '2026-10-10', endDate: '2026-10-10', seats: 30, seatsAvailable: 20, price: 2500, description: 'Hands-on training for oxygen concentrator operation and maintenance.', topics: ['Operating principles', 'Filter cleaning', 'Flow calibration', 'Troubleshooting', 'Home care setup'], certification: true, certificateValidity: '1 Year', status: 'Upcoming' },
  { id: 5, title: 'Medical Equipment Safety Standards', equipmentCategory: 'General', trainer: 'Er. Rajiv Maharjan', trainerTitle: 'Quality Assurance Engineer', duration: '2 Days', location: 'Kathmandu', mode: 'Hybrid', startDate: '2026-10-15', endDate: '2026-10-16', seats: 40, seatsAvailable: 28, price: 6000, description: 'Understanding IEC 60601 and other medical equipment safety standards.', topics: ['IEC 60601 overview', 'Electrical safety', 'Risk management', 'Compliance testing', 'Documentation'], certification: true, certificateValidity: '3 Years', status: 'Upcoming' },
  { id: 6, title: 'Ultrasound Basic Operation', equipmentCategory: 'Diagnostic Equipment', brand: 'Mindray', trainer: 'Dr. Anita Poudel', trainerTitle: 'Radiologist', duration: '3 Days', location: 'Kathmandu', mode: 'Onsite', startDate: '2026-11-01', endDate: '2026-11-03', seats: 15, seatsAvailable: 10, price: 12000, description: 'Basic ultrasound machine operation and image optimization.', topics: ['Machine setup', 'Probe selection', 'Image optimization', 'Basic scanning', 'Maintenance'], certification: true, certificateValidity: '2 Years', status: 'Upcoming' },
  { id: 7, title: 'Defibrillator Operation & CPR', equipmentCategory: 'Emergency Equipment', trainer: 'Dr. Ram K. Thapa', trainerTitle: 'Emergency Medicine Specialist', duration: '1 Day', location: 'Kathmandu', mode: 'Onsite', startDate: '2026-11-10', endDate: '2026-11-10', seats: 30, seatsAvailable: 18, price: 4000, description: 'Hands-on defibrillator operation combined with CPR training.', topics: ['Defibrillator types', 'AED operation', 'Manual defibrillation', 'CPR protocols', 'Emergency response'], certification: true, certificateValidity: '1 Year', status: 'Upcoming' },
  { id: 8, title: 'Hospital Equipment Planning', equipmentCategory: 'General', trainer: 'Er. Suman Adhikari', trainerTitle: 'Clinical Engineer', duration: '2 Days', location: 'Online', mode: 'Online', startDate: '2026-11-20', endDate: '2026-11-21', seats: 25, seatsAvailable: 22, price: 8000, description: 'Planning and budgeting for hospital equipment procurement.', topics: ['Need assessment', 'Budget planning', 'Vendor evaluation', 'Procurement process', 'Installation planning'], certification: true, certificateValidity: '3 Years', status: 'Upcoming' },
]

// Blog posts
export const BLOG_POSTS: BlogPost[] = [
  { id: 1, title: 'How to Maintain Your Medical Equipment for Longevity', slug: 'maintain-medical-equipment', excerpt: 'Regular maintenance extends the life of medical equipment and ensures patient safety. Learn the essential maintenance practices.', content: '', image: '/assets/generated/hero-engineering.png', author: 'Er. Bikash Tamang', date: '2026-07-15', category: 'Maintenance', readTime: '5 min', tags: ['Maintenance', 'Equipment Care', 'Hospital'] },
  { id: 2, title: 'Renting vs Buying Medical Equipment: Which is Better?', slug: 'renting-vs-buying', excerpt: 'A comprehensive comparison of renting and buying medical equipment for different healthcare needs and budgets.', content: '', image: '/assets/generated/hero-marketplace.png', author: 'Mediko Bazaar Team', date: '2026-07-10', category: 'Guide', readTime: '7 min', tags: ['Rental', 'Buying Guide', 'Cost Analysis'] },
  { id: 3, title: 'Oxygen Concentrator Care: A Complete Guide', slug: 'oxygen-concentrator-care', excerpt: 'Everything you need to know about maintaining and caring for your oxygen concentrator at home.', content: '', image: '/assets/generated/hero-homecare.png', author: 'Dr. Priya Shrestha', date: '2026-07-05', category: 'Home Care', readTime: '6 min', tags: ['Oxygen Concentrator', 'Home Care', 'Respiratory'] },
  { id: 4, title: 'The Importance of Regular Equipment Calibration', slug: 'equipment-calibration', excerpt: 'Why regular calibration is critical for medical equipment accuracy, patient safety and compliance.', content: '', image: '/assets/generated/category-monitoring.png', author: 'Er. Suman Adhikari', date: '2026-06-28', category: 'Technical', readTime: '4 min', tags: ['Calibration', 'Safety', 'Compliance'] },
  { id: 5, title: 'Setting Up a Hospital: Equipment Essentials', slug: 'hospital-setup-essentials', excerpt: 'A comprehensive guide to essential medical equipment for setting up a new hospital or clinic in Nepal.', content: '', image: '/assets/generated/category-furniture.png', author: 'Mediko Bazaar Team', date: '2026-06-20', category: 'Guide', readTime: '10 min', tags: ['Hospital Setup', 'Equipment List', 'Planning'] },
  { id: 6, title: 'Medical Equipment Safety: Best Practices', slug: 'equipment-safety', excerpt: 'Essential safety practices for handling and operating medical equipment in healthcare settings.', content: '', image: '/assets/generated/hero-training.png', author: 'Er. Rajiv Maharjan', date: '2026-06-15', category: 'Safety', readTime: '6 min', tags: ['Safety', 'Best Practices', 'Compliance'] },
  { id: 7, title: 'Guide to Inspecting Used Medical Equipment', slug: 'inspecting-used-equipment', excerpt: 'What to look for when buying used medical equipment — inspection checklist and quality assessment.', content: '', image: '/assets/generated/category-ultrasound.png', author: 'Er. Bikash Tamang', date: '2026-06-10', category: 'Used Equipment', readTime: '8 min', tags: ['Used Equipment', 'Inspection', 'Quality'] },
  { id: 8, title: 'Understanding Import Duties for Medical Equipment in Nepal', slug: 'import-duties-nepal', excerpt: 'A breakdown of customs duties, taxes and regulations for importing medical equipment into Nepal.', content: '', image: '/assets/generated/hero-marketplace.png', author: 'Mediko Bazaar Team', date: '2026-06-05', category: 'Import', readTime: '7 min', tags: ['Import', 'Customs', 'Nepal', 'Regulations'] },
  { id: 9, title: 'Top 5 Must-Have Equipment for Clinics in 2026', slug: 'top-equipment-clinics', excerpt: 'The essential medical equipment every modern clinic should have for efficient patient care.', content: '', image: '/assets/generated/hero-diagnostics.png', author: 'Dr. Ram K. Thapa', date: '2026-05-28', category: 'Guide', readTime: '5 min', tags: ['Clinic', 'Equipment', 'Essentials'] },
  { id: 10, title: 'Benefits of Annual Maintenance Contracts (AMC)', slug: 'amc-benefits', excerpt: 'Why investing in an AMC for your medical equipment saves money and ensures uninterrupted service.', content: '', image: '/assets/generated/hero-engineering.png', author: 'Er. Suman Adhikari', date: '2026-05-20', category: 'Maintenance', readTime: '5 min', tags: ['AMC', 'Maintenance', 'Cost Savings'] },
]

// Testimonials
export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: 'Dr. Anil Sharma', title: 'Hospital Administrator', organization: 'Nepal Medical College', content: 'Mediko Bazaar provided us with excellent equipment and outstanding after-sales support. Their engineering team is highly reliable and professional.', rating: 5, avatar: 'AS' },
  { id: 2, name: 'Dr. Ayesha Khan', title: 'Clinic Owner', organization: 'Kathmandu Health Clinic', content: 'Excellent quality products and on-time delivery. Mediko Bazaar is our trusted partner for medical equipment procurement.', rating: 5, avatar: 'AK' },
  { id: 3, name: 'Ram B. Shrestha', title: 'Home Care Customer', organization: 'Individual', content: 'The rental service helped us a lot during our short-term need. The process was smooth and support was great!', rating: 5, avatar: 'RS' },
  { id: 4, name: 'Er. Bikash K.C.', title: 'Biomedical Engineer', organization: 'Bir Hospital', content: 'We got genuine spare parts and fast delivery across Nepal. Highly recommended for biomedical engineering needs.', rating: 4, avatar: 'BK' },
  { id: 5, name: 'Anita Thapa', title: 'Procurement Manager', organization: 'Grande Hospital', content: 'Import cost calculation is very accurate. Helped us save time and money. Professional service and reliable quotations.', rating: 5, avatar: 'AT' },
]

// Engineers
export const ENGINEERS: Engineer[] = [
  { id: 1, name: 'Er. Bikash Tamang', title: 'Senior Biomedical Engineer', photo: 'BT', specializations: ['Patient Monitors', 'Ventilators', 'Infusion Pumps'], experience: '8 years', rating: 4.9, reviews: 156, serviceArea: ['Kathmandu Valley', 'Pokhara'], certifications: ['BMET Certified', 'ISO 13485'], availability: 'Available', completedJobs: 342, verified: true },
  { id: 2, name: 'Er. Suman Adhikari', title: 'Clinical Engineer', photo: 'SA', specializations: ['Ultrasound', 'X-Ray', 'CT Scanner'], experience: '10 years', rating: 4.8, reviews: 198, serviceArea: ['Kathmandu Valley', 'Chitwan', 'Biratnagar'], certifications: ['BMET Certified', 'Mindray Certified'], availability: 'Available', completedJobs: 456, verified: true },
  { id: 3, name: 'Er. Rajiv Maharjan', title: 'Quality Assurance Engineer', photo: 'RM', specializations: ['Calibration', 'Inspection', 'Safety Testing'], experience: '6 years', rating: 4.7, reviews: 89, serviceArea: ['Kathmandu Valley'], certifications: ['ISO 17025', 'IEC 60601'], availability: 'Available', completedJobs: 234, verified: true },
  { id: 4, name: 'Er. Priyanka Rai', title: 'Biomedical Technician', photo: 'PR', specializations: ['Lab Equipment', 'Autoclave', 'Microscope'], experience: '5 years', rating: 4.6, reviews: 67, serviceArea: ['Kathmandu Valley', 'Lalitpur'], certifications: ['BMET Certified'], availability: 'Available', completedJobs: 178, verified: true },
  { id: 5, name: 'Er. Dipak Gurung', title: 'Field Service Engineer', photo: 'DG', specializations: ['Hospital Beds', 'Oxygen Systems', 'Sterilizers'], experience: '7 years', rating: 4.8, reviews: 134, serviceArea: ['Pokhara', 'Gandaki Province'], certifications: ['BMET Certified'], availability: 'Busy', completedJobs: 289, verified: true },
  { id: 6, name: 'Er. Sunita Sharma', title: 'Installation Specialist', photo: 'SS', specializations: ['Equipment Installation', 'Commissioning', 'Site Planning'], experience: '4 years', rating: 4.5, reviews: 56, serviceArea: ['Kathmandu Valley'], certifications: ['BMET Certified', 'Philips Certified'], availability: 'Available', completedJobs: 145, verified: true },
  { id: 7, name: 'Er. Arun Thakur', title: 'Senior Service Engineer', photo: 'AT', specializations: ['Defibrillators', 'ECG Machines', 'Monitors'], experience: '12 years', rating: 4.9, reviews: 234, serviceArea: ['Kathmandu Valley', 'Nationwide'], certifications: ['BMET Certified', 'GE Certified', 'Philips Certified'], availability: 'Available', completedJobs: 567, verified: true },
  { id: 8, name: 'Er. Nisha Poudel', title: 'Respiratory Equipment Specialist', photo: 'NP', specializations: ['Ventilators', 'CPAP', 'BiPAP', 'Oxygen Concentrators'], experience: '6 years', rating: 4.7, reviews: 98, serviceArea: ['Kathmandu Valley', 'Chitwan'], certifications: ['BMET Certified', 'Dräger Certified'], availability: 'Available', completedJobs: 212, verified: true },
  { id: 9, name: 'Er. Ramesh Bhandari', title: 'Imaging Equipment Engineer', photo: 'RB', specializations: ['Ultrasound', 'X-Ray', 'C-Arm'], experience: '9 years', rating: 4.8, reviews: 167, serviceArea: ['Kathmandu Valley', 'Bhairahawa'], certifications: ['BMET Certified', 'Siemens Certified'], availability: 'On Leave', completedJobs: 378, verified: true },
  { id: 10, name: 'Er. Kiran Shrestha', title: 'Preventive Maintenance Lead', photo: 'KS', specializations: ['PMC', 'AMC', 'Equipment Auditing'], experience: '8 years', rating: 4.6, reviews: 112, serviceArea: ['Nationwide'], certifications: ['BMET Certified', 'ISO 13485'], availability: 'Available', completedJobs: 445, verified: true },
]

// Sellers
export const SELLERS: Seller[] = [
  { id: 1, name: 'MediTech Solutions', type: 'Authorized Dealer', verified: true, rating: 4.8, reviews: 567, products: 120, location: 'Kathmandu', joinedDate: '2022-03-15', description: 'Authorized dealer for Mindray, BPL and other major medical equipment brands.' },
  { id: 2, name: 'Global Medical Imports', type: 'Distributor', verified: true, rating: 4.7, reviews: 423, products: 85, location: 'Kathmandu', joinedDate: '2021-08-20', description: 'Leading medical equipment importer and distributor in Nepal.' },
  { id: 3, name: 'Nepal Med Supply', type: 'Distributor', verified: true, rating: 4.6, reviews: 345, products: 95, location: 'Kathmandu', joinedDate: '2022-01-10', description: 'Comprehensive medical supply company serving hospitals across Nepal.' },
  { id: 4, name: 'HealthTech Nepal', type: 'Authorized Dealer', verified: true, rating: 4.9, reviews: 234, products: 65, location: 'Kathmandu', joinedDate: '2021-05-12', description: 'Premium medical equipment dealer specializing in ICU and critical care.' },
  { id: 5, name: 'Swiss Med Nepal', type: 'Authorized Dealer', verified: true, rating: 4.7, reviews: 189, products: 45, location: 'Lalitpur', joinedDate: '2022-06-01', description: 'Authorized dealer for Schiller and European medical equipment brands.' },
  { id: 6, name: 'MediCare Nepal', type: 'Distributor', verified: true, rating: 4.5, reviews: 678, products: 150, location: 'Kathmandu', joinedDate: '2020-11-15', description: 'Nepal\'s largest home care and consumer medical device supplier.' },
  { id: 7, name: 'MediRent Nepal', type: 'Reseller', verified: true, rating: 4.6, reviews: 234, products: 40, location: 'Kathmandu', joinedDate: '2023-02-20', description: 'Specialized medical equipment rental company for home and hospital use.' },
  { id: 8, name: 'Spare Parts Nepal', type: 'Reseller', verified: true, rating: 4.4, reviews: 456, products: 200, location: 'Kathmandu', joinedDate: '2022-09-10', description: 'Largest medical equipment spare parts supplier in Nepal.' },
  { id: 9, name: 'Verified Resale Nepal', type: 'Reseller', verified: true, rating: 4.5, reviews: 123, products: 30, location: 'Kathmandu', joinedDate: '2023-06-15', description: 'Verified and inspected used medical equipment marketplace.' },
  { id: 10, name: 'PreOwned Medical', type: 'Individual', verified: true, rating: 4.3, reviews: 67, products: 15, location: 'Bhaktapur', joinedDate: '2023-09-01', description: 'Quality pre-owned medical equipment with inspection reports.' },
  { id: 11, name: 'BioMed Supplies', type: 'Distributor', verified: true, rating: 4.6, reviews: 198, products: 75, location: 'Pokhara', joinedDate: '2022-04-18', description: 'Medical equipment and supplies distributor for Western Nepal.' },
  { id: 12, name: 'NepalMed Trading', type: 'Distributor', verified: true, rating: 4.5, reviews: 156, products: 60, location: 'Biratnagar', joinedDate: '2023-01-25', description: 'Medical equipment trading company serving Eastern Nepal.' },
]
