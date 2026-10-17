import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Mediko Bazaar database...')

  // 1. Clean existing records in reverse dependency order
  await prisma.refreshToken.deleteMany({})
  await prisma.chatMessage.deleteMany({})
  await prisma.invoice.deleteMany({})
  await prisma.order.deleteMany({})
  await prisma.quotation.deleteMany({})
  await prisma.landingCostEstimate.deleteMany({})
  await prisma.enquiry.deleteMany({})
  await prisma.serviceBooking.deleteMany({})
  await prisma.rentalBooking.deleteMany({})
  await prisma.product.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.supportTicket.deleteMany({})
  await prisma.user.deleteMany({})

  const defaultPasswordHash = await bcrypt.hash('Mediko@2026', 10)

  // 2. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@medikobazaar.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Super Administrator',
      role: 'ADMIN',
      phone: '+977 9851188274',
      organization: 'Mediko Bazar Pvt. Ltd.',
      city: 'Kathmandu',
      kycStatus: 'VERIFIED',
    },
  })

  const vendorUser = await prisma.user.create({
    data: {
      email: 'meditech@nepalmed.com',
      passwordHash: defaultPasswordHash,
      fullName: 'MediTech Solutions Nepal',
      role: 'VENDOR',
      phone: '+977 9814823222',
      organization: 'MediTech Solutions Pvt. Ltd.',
      city: 'Lalitpur',
      kycStatus: 'VERIFIED',
      panVatNumber: '601248991',
    },
  })

  const sellerUser = await prisma.user.create({
    data: {
      email: 'sales@globalmindray.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Mindray Global Exports',
      role: 'INTERNATIONAL_SELLER',
      phone: '+86 755 8188 8998',
      organization: 'Mindray Bio-Medical Electronics Co.',
      city: 'Shenzhen',
      kycStatus: 'VERIFIED',
    },
  })

  const engineerUser = await prisma.user.create({
    data: {
      email: 'er.suman@medikobazaar.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Er. Suman Adhikari',
      role: 'ENGINEER',
      phone: '+977 9841234567',
      organization: 'Mediko Biomedical Services',
      city: 'Kathmandu',
      kycStatus: 'VERIFIED',
    },
  })

  const customerUser = await prisma.user.create({
    data: {
      email: 'procurement@birhospital.org',
      passwordHash: defaultPasswordHash,
      fullName: 'Dr. Rajan Shrestha (Bir Hospital)',
      role: 'CUSTOMER',
      phone: '+977 9851099887',
      organization: 'Bir Hospital Kathmandu',
      city: 'Kathmandu',
      kycStatus: 'VERIFIED',
      panVatNumber: '300021487',
    },
  })

  const accountingUser = await prisma.user.create({
    data: {
      email: 'accounting@medikobazaar.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Sunil Pokharel (Finance & IRD Tax Head)',
      role: 'ADMIN',
      phone: '+977 9851199001',
      organization: 'Mediko Bazaar Accounts & IRD Compliance',
      city: 'Kathmandu',
      kycStatus: 'VERIFIED',
      panVatNumber: '600123456',
    },
  })

  const ordersUser = await prisma.user.create({
    data: {
      email: 'orders@medikobazaar.com',
      passwordHash: defaultPasswordHash,
      fullName: 'Bikram Rayamajhi (Logistics & Fleet Operations)',
      role: 'ADMIN',
      phone: '+977 9851199002',
      organization: 'Mediko Bazaar Logistics & Dispatch',
      city: 'Kathmandu',
      kycStatus: 'VERIFIED',
    },
  })

  // 3. Seed Categories (Professional Vector Icon Keys - No Emojis)
  const categoriesData = [
    { name: 'Patient Care', slug: 'patient-care', icon: 'HeartPulse', count: 1240, color: '#EFF6FF', description: 'ICU monitors, patient monitoring systems and vitals tracking' },
    { name: 'Home Care', slug: 'home-care', icon: 'Home', count: 850, color: '#FFF3EA', description: 'Home healthcare devices, mobility, beds and patient comfort equipment' },
    { name: 'Diagnostic', slug: 'diagnostic', icon: 'Stethoscope', count: 950, color: '#ECFDF5', description: 'ECG machines, ultrasound, blood pressure, diagnostic instruments' },
    { name: 'Respiratory Care', slug: 'respiratory-care', icon: 'Wind', count: 650, color: '#F5F3FF', description: 'Oxygen concentrators, ventilators, BiPAP, CPAP and nebulizers' },
    { name: 'Hospital Furniture', slug: 'hospital-furniture', icon: 'Bed', count: 700, color: '#FFFBEB', description: 'Electric ICU beds, manual crank beds, examination tables, trolleys' },
    { name: 'Surgical Instruments', slug: 'surgical-instruments', icon: 'Scissors', count: 950, color: '#FEF2F2', description: 'OT equipment, surgical lights, autoclave sterilizers, forceps' },
    { name: 'Spare Parts', slug: 'spare-parts', icon: 'Cog', count: 2500, color: '#F8FAFC', description: 'Original OEM and compatible medical equipment spare parts' },
    { name: 'Certified Pre-Owned', slug: 'certified-pre-owned', icon: 'ShieldCheck', count: 450, color: '#ECFEFF', description: '100% Inspected, biomedical verified and guaranteed pre-owned equipment' },
  ]

  const categoryMap = {}
  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        itemCount: cat.count,
        color: cat.color,
        description: cat.description,
      },
    })
    categoryMap[cat.name] = created.id
  }

  // 4. Seed Products
  const products = [
    // Top Featured 1: Mindray BeneVision N1
    {
      title: 'Mindray BeneVision N1 Patient Monitor',
      slug: 'mindray-benevision-n1-patient-monitor',
      brand: 'Mindray',
      model: 'BeneVision N1',
      sku: 'MB-PM-001',
      categoryId: categoryMap['Patient Care'],
      sellerId: vendorUser.id,
      sellerName: 'MediTech Solutions',
      type: 'NEW',
      condition: 'Brand New',
      price: 145000,
      oldPrice: 165000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.9,
      reviewsCount: 142,
      badge: 'Best Seller',
      image: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=500&h=400&fit=crop&auto=format',
      description: 'Compact 5.5-inch transport patient monitor with advanced multi-parameter measurement and seamless hospital network integration.',
      specifications: { Display: '5.5" Capacitive Touchscreen', Parameters: 'ECG, SpO2, NIBP, Dual Temp, IBP', Battery: '8 Hours continuous run', Weight: '950 grams' },
      features: ['Palm-sized design', 'Seamless data transfer', 'IP44 water/dust resistance', 'Continuous patient monitoring during transit'],
      warrantyPeriod: '2 Years Manufacturer Warranty',
      installationAvailable: true,
      engineerSupport: true,
      forHospital: true,
    },
    // Top Featured 2: Drive Medical Wheelchair (Rental)
    {
      title: 'Drive Medical Standard Wheelchair - Chrome Foldable',
      slug: 'drive-medical-standard-wheelchair-chrome',
      brand: 'Drive Medical',
      model: 'STD-WC-20',
      sku: 'MB-RN-001',
      categoryId: categoryMap['Home Care'],
      sellerId: vendorUser.id,
      sellerName: 'MediRent Nepal',
      type: 'RENTAL',
      condition: 'New Condition',
      price: 14500,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.8,
      reviewsCount: 88,
      badge: 'Rental',
      rentalDaily: 150,
      rentalWeekly: 900,
      rentalMonthly: 2400,
      rentalDeposit: 5000,
      rentalPenaltyDaily: 250,
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=500&h=400&fit=crop&auto=format',
      description: 'Heavy duty chrome-plated foldable wheelchair with padded armrests, swing-away footrests, and puncture-proof solid rubber tyres.',
      specifications: { Frame: 'Carbon steel with chrome finish', SeatWidth: '18 inches', WeightCapacity: '135 kg', ProductWeight: '17.5 kg' },
      features: ['Foldable lightweight frame', 'Padded armrests', 'Easy maintenance', 'Quick-release footrests'],
      warrantyPeriod: '1 Year Warranty',
      forHomeCare: true,
      forHospital: true,
    },
    // Top Featured 3: Philips EverFlo Oxygen Concentrator
    {
      title: 'Philips EverFlo Oxygen Concentrator 5L Continuous Flow',
      slug: 'philips-everflo-oxygen-concentrator-5l',
      brand: 'Philips',
      model: 'EverFlo 5L',
      sku: 'MB-RC-001',
      categoryId: categoryMap['Respiratory Care'],
      sellerId: vendorUser.id,
      sellerName: 'Global Medical Imports',
      type: 'NEW',
      condition: 'Brand New',
      price: 95000,
      oldPrice: 110000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.9,
      reviewsCount: 215,
      badge: 'New',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=500&h=400&fit=crop&auto=format',
      description: 'Ultra-quiet, energy-efficient 5-liter stationary oxygen concentrator engineered for continuous hospital and home clinical therapy.',
      specifications: { FlowRate: '0.5 to 5.0 LPM', OxygenPurity: '93% +/- 3%', SoundLevel: '45 dBA', Weight: '14 kg' },
      features: ['Low power consumption', 'Integrated OPI oxygen purity indicator', 'Compact ergonomic handle', 'Low maintenance filter'],
      warrantyPeriod: '3 Years Full Warranty',
      installationAvailable: true,
      forHomeCare: true,
      forHospital: true,
    },
    // Top Featured 4: Omron M7 Intelli IT
    {
      title: 'Omron M7 Intelli IT Bluetooth Blood Pressure Monitor',
      slug: 'omron-m7-intelli-it-blood-pressure-monitor',
      brand: 'Omron',
      model: 'M7 Intelli IT',
      sku: 'MB-DG-001',
      categoryId: categoryMap['Diagnostic'],
      sellerId: vendorUser.id,
      sellerName: 'MediCare Nepal',
      type: 'NEW',
      condition: 'Brand New',
      price: 18500,
      oldPrice: 22000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.7,
      reviewsCount: 384,
      badge: 'Verified',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=400&fit=crop&auto=format',
      description: 'Clinically validated upper arm blood pressure monitor with AFib detection, Intelli Wrap Cuff 360° accuracy, and smartphone sync.',
      specifications: { CuffSize: '22 - 42 cm', Memory: '2 Users x 100 Readings', Connectivity: 'Bluetooth Smart', AFibIndicator: 'Yes' },
      features: ['AFib detection alert', 'Intelli Wrap 360° cuff', 'Omron connect app sync', 'Triple measurement averaging'],
      warrantyPeriod: '5 Years Manufacturer Warranty',
      forHomeCare: true,
      forHospital: true,
    },
    // Top Featured 5: Dräger Savina 300 Ventilator (Certified Pre-Owned)
    {
      title: 'Dräger Savina 300 ICU Ventilator (Certified Pre-Owned)',
      slug: 'draeger-savina-300-icu-ventilator-certified-pre-owned',
      brand: 'Dräger',
      model: 'Savina 300',
      sku: 'MB-CPO-001',
      categoryId: categoryMap['Certified Pre-Owned'],
      sellerId: vendorUser.id,
      sellerName: 'Mediko Certified Resale',
      type: 'CERTIFIED_PRE_OWNED',
      condition: 'Certified Pre-Owned - Grade A',
      conditionGrade: 'GRADE_A',
      yearOfManufacture: 2022,
      usageHours: 2400,
      inspectionStatus: 'Passed 48-Point Biomedical Audit',
      verificationStatus: 'Mediko Certified',
      price: null,
      askForPrice: true,
      currency: 'NPR',
      rating: 4.9,
      reviewsCount: 19,
      badge: 'Certified Pre-Owned',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&h=400&fit=crop&auto=format',
      description: 'High-end turbine-driven ICU ventilator inspected and certified by Mediko biomedical engineers. Complete with full calibration certificate.',
      specifications: { VentilationModes: 'VC-CMV, VC-AC, PC-BIPAP, SPN-CPAP/PS', TurbineFlow: 'Up to 250 L/min', Battery: 'Internal 5 Hours', Screen: '12" Color Touch' },
      features: ['Independent turbine air supply', 'Non-invasive ventilation', 'Complete biomedical inspection report', '6-Month Mediko warranty included'],
      warrantyPeriod: '6 Months Mediko Comprehensive Warranty',
      installationAvailable: true,
      engineerSupport: true,
      trainingAvailable: true,
      forHospital: true,
    },
    // Top Featured 6: Oxygen Concentrator Valve Assembly (Spare Part)
    {
      title: 'Oxygen Concentrator Valve Assembly & Manifold Block',
      slug: 'oxygen-concentrator-valve-assembly-manifold',
      brand: 'Yuwell',
      model: 'VA-8F5',
      sku: 'MB-SP-001',
      categoryId: categoryMap['Spare Parts'],
      sellerId: vendorUser.id,
      sellerName: 'Spare Parts Nepal',
      type: 'SPARE_PART',
      condition: 'New OEM Spare',
      price: 1850,
      oldPrice: 2400,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.6,
      reviewsCount: 76,
      badge: 'Spare Part',
      partNumber: 'YUW-VA-091',
      isOEM: true,
      compatibleEquipment: ['Yuwell 8F-5AW', 'Yuwell 7F-5', 'Philips EverFlo 5L'],
      image: 'https://images.unsplash.com/photo-1583912086096-8c60d75a53f9?w=500&h=400&fit=crop&auto=format',
      description: 'Original factory solenoid valve block and manifold assembly for medical grade 5-liter oxygen concentrators.',
      warrantyPeriod: '6 Months Warranty',
      forHospital: true,
    },
    // Category items and slider items
    {
      title: 'Yuwell 8F-5AW Medical Oxygen Concentrator 5L',
      slug: 'yuwell-8f-5aw-oxygen-concentrator-5l',
      brand: 'Yuwell',
      model: '8F-5AW',
      sku: 'MB-RC-002',
      categoryId: categoryMap['Respiratory Care'],
      type: 'NEW',
      condition: 'New',
      price: 85000,
      oldPrice: 95000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.6,
      reviewsCount: 94,
      image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=300&fit=crop&auto=format',
      description: 'Compact 5L oxygen concentrator with nebulizer function and remote control.',
    },
    {
      title: 'Microlife NEB 400 Children & Adult Compressor Nebulizer',
      slug: 'microlife-neb-400-compressor-nebulizer',
      brand: 'Microlife',
      model: 'NEB 400',
      sku: 'MB-RC-003',
      categoryId: categoryMap['Respiratory Care'],
      type: 'NEW',
      condition: 'New',
      price: 7500,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.7,
      reviewsCount: 165,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop&auto=format',
      description: 'High efficiency nebulizer with polar bear child friendly design, adult mask and rapid therapy delivery.',
    },
    {
      title: 'Welch Allyn 767 Wall Integrated Diagnostic Set',
      slug: 'welch-allyn-767-wall-diagnostic-set',
      brand: 'Welch Allyn',
      model: '767 Series',
      sku: 'MB-DG-002',
      categoryId: categoryMap['Diagnostic'],
      type: 'NEW',
      condition: 'New',
      price: 65000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.8,
      reviewsCount: 42,
      image: 'https://images.unsplash.com/photo-1551190822-a9ce113ac100?w=400&h=300&fit=crop&auto=format',
      description: 'Wall mount ophthalmoscope, otoscope and cuff system for hospital examination rooms.',
    },
    {
      title: 'BLT Portable Diagnostic Ultrasound Scanner BPU60',
      slug: 'blt-portable-ultrasound-scanner-bpu60',
      brand: 'BLT',
      model: 'BPU60',
      sku: 'MB-DG-003',
      categoryId: categoryMap['Diagnostic'],
      type: 'NEW',
      condition: 'New',
      price: 125000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.6,
      reviewsCount: 31,
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&h=300&fit=crop&auto=format',
      description: 'High resolution digital portable ultrasound scanner with multi-frequency convex and linear probes.',
    },
    {
      title: 'Mindray uMEC12 Clinical Patient Monitor 12.1" Display',
      slug: 'mindray-umec12-clinical-patient-monitor',
      brand: 'Mindray',
      model: 'uMEC12',
      sku: 'MB-PM-002',
      categoryId: categoryMap['Patient Care'],
      type: 'NEW',
      condition: 'New',
      price: 125000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.8,
      reviewsCount: 78,
      image: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?w=400&h=300&fit=crop&auto=format',
      description: 'Cost-effective clinical monitor with low power consumption and durable casing.',
    },
    {
      title: 'SunTech CT40 Ambulatory Blood Pressure Monitor',
      slug: 'suntech-ct40-ambulatory-bp-monitor',
      brand: 'SunTech',
      model: 'CT40',
      sku: 'MB-DG-004',
      categoryId: categoryMap['Diagnostic'],
      type: 'NEW',
      condition: 'New',
      price: 22000,
      askForPrice: false,
      currency: 'NPR',
      rating: 4.5,
      reviewsCount: 54,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&auto=format',
      description: 'Hospital grade spot check and continuous blood pressure monitoring system.',
    },
  ]

  for (const item of products) {
    await prisma.product.create({
      data: {
        title: item.title,
        slug: item.slug,
        brand: item.brand,
        model: item.model,
        sku: item.sku,
        categoryId: item.categoryId,
        sellerId: item.sellerId || vendorUser.id,
        sellerName: item.sellerName || 'MediTech Solutions',
        sellerVerified: true,
        type: item.type,
        condition: item.condition,
        conditionGrade: item.conditionGrade || 'BRAND_NEW',
        yearOfManufacture: item.yearOfManufacture,
        usageHours: item.usageHours || 0,
        inspectionStatus: item.inspectionStatus || 'Passed',
        verificationStatus: item.verificationStatus || 'Verified',
        price: item.price,
        oldPrice: item.oldPrice,
        askForPrice: item.askForPrice || false,
        currency: item.currency || 'NPR',
        rating: item.rating || 4.8,
        reviewsCount: item.reviewsCount || 25,
        badge: item.badge,
        image: item.image,
        description: item.description,
        specifications: item.specifications || {},
        features: item.features || [],
        warrantyPeriod: item.warrantyPeriod || '1 Year',
        installationAvailable: item.installationAvailable || false,
        engineerSupport: item.engineerSupport || false,
        trainingAvailable: item.trainingAvailable || false,
        forHospital: item.forHospital !== undefined ? item.forHospital : true,
        forHomeCare: item.forHomeCare || false,
        rentalDaily: item.rentalDaily,
        rentalWeekly: item.rentalWeekly,
        rentalMonthly: item.rentalMonthly,
        rentalDeposit: item.rentalDeposit,
        rentalPenaltyDaily: item.rentalPenaltyDaily,
        partNumber: item.partNumber,
        isOEM: item.isOEM || false,
        compatibleEquipment: item.compatibleEquipment || [],
      },
    })
  }

  // 5. Seed Sample Rental Booking
  const rentalProduct = await prisma.product.findFirst({ where: { type: 'RENTAL' } })
  if (rentalProduct) {
    await prisma.rentalBooking.create({
      data: {
        bookingNumber: 'RNT-2026-001',
        customerId: customerUser.id,
        productId: rentalProduct.id,
        durationType: 'MONTHLY',
        durationValue: 2,
        startDate: new Date('2026-09-01'),
        endDate: new Date('2026-11-01'),
        rentAmount: 4800,
        depositAmount: 5000,
        status: 'ACTIVE',
        deliveryAddress: 'Bir Hospital Emergency Department, Ward 3, Kathmandu',
      },
    })
  }

  // 6. Seed Sample Engineering Ticket & Direct Chat Communication
  const serviceBooking = await prisma.serviceBooking.create({
    data: {
      ticketNumber: 'SRV-2026-084',
      customerId: customerUser.id,
      engineerId: engineerUser.id,
      equipmentTitle: 'Mindray MEC-1200 Monitor',
      equipmentBrand: 'Mindray',
      equipmentModel: 'MEC-1200',
      serialNumber: 'SN-MRY-998124',
      serviceType: 'CALIBRATION',
      problemDescription: 'Annual biomedical NIBP and SpO2 precision sensor calibration and electrical safety test.',
      hospitalLocation: 'Bir Hospital, ICU Ward 2, Kathmandu',
      preferredDate: new Date('2026-09-10'),
      scheduledDate: new Date('2026-09-10'),
      status: 'ASSIGNED',
      cost: 4500,
    },
  })

  await prisma.chatMessage.createMany({
    data: [
      {
        serviceBookingId: serviceBooking.id,
        senderId: customerUser.id,
        senderName: 'Dr. Rajan Shrestha (Bir Hospital)',
        senderRole: 'CUSTOMER',
        message: 'Namaste Er. Suman, the SpO2 waveform on our MEC-1200 is fluctuating in ICU Ward 2. Could you inspect it during today\'s visit?',
        createdAt: new Date(Date.now() - 3600000 * 2),
      },
      {
        serviceBookingId: serviceBooking.id,
        senderId: engineerUser.id,
        senderName: 'Er. Suman Adhikari (Biomedical Engineer)',
        senderRole: 'ENGINEER',
        message: 'Namaste Dr. Rajan, noted! I have Fluke Biomedical optical simulator and digital pressure calibrator with me. On my way, ETA 11:30 AM.',
        createdAt: new Date(Date.now() - 3600000 * 1.5),
      },
      {
        serviceBookingId: serviceBooking.id,
        senderId: customerUser.id,
        senderName: 'Dr. Rajan Shrestha (Bir Hospital)',
        senderRole: 'CUSTOMER',
        message: 'Thank you Er. Suman. Please inform Sister In-Charge Deepa upon arrival at ICU Ward 2.',
        createdAt: new Date(Date.now() - 3600000),
      },
      {
        serviceBookingId: serviceBooking.id,
        senderId: engineerUser.id,
        senderName: 'Er. Suman Adhikari (Biomedical Engineer)',
        senderRole: 'ENGINEER',
        message: 'Understood. Will conduct electrical safety grounding test (IEC 62353) and issue digital calibration certificate on the spot.',
        createdAt: new Date(Date.now() - 1800000),
      },
    ],
  })

  // 7. Seed Sample Enquiry & Nepal Landing Cost Calculation
  const enquiry = await prisma.enquiry.create({
    data: {
      enquiryNumber: 'ENQ-2026-119',
      customerId: customerUser.id,
      enquiryType: 'IMPORT_CALCULATION',
      title: 'GE CARESCAPE B650 Critical Care Monitor Direct Import',
      quantity: 2,
      targetPrice: 1120000,
      countryOfOrigin: 'USA / Germany',
      shippingMode: 'AIR_CARGO',
      destination: 'Tribhuvan International Airport Cargo, Kathmandu',
      hsCode: '9018.19.00',
      notes: 'Require official landing cost estimation including customs tariff, airport clearance, and VAT for government hospital procurement.',
      status: 'QUOTATION_SENT',
    },
  })

  await prisma.landingCostEstimate.create({
    data: {
      enquiryId: enquiry.id,
      productPriceUSD: 7200.00,
      exchangeRateNPR: 134.50,
      productCostNPR: 968400.00,
      freightUSD: 450.00,
      insuranceUSD: 85.00,
      customsDutyPercent: 5.00,
      customsDutyNPR: 52020.00,
      vatPercent: 13.00,
      vatNPR: 142014.00,
      portClearanceNPR: 25000.00,
      bankForexCommissionNPR: 8500.00,
      localTransportNPR: 12000.00,
      medikoCommissionNPR: 35000.00,
      totalLandingCostNPR: 1242934.00,
      marginPercent: 8.00,
      finalQuotationPriceNPR: 1342000.00,
      breakdownJson: {
        hsCode: '9018.19.00',
        shippingMode: 'Air Cargo',
        origin: 'Frankfurt -> Kathmandu',
        dutyRate: '5%',
        vatRate: '13%',
      },
    },
  })

  console.log('Mediko Bazaar database seeded successfully with realistic healthcare records!')
}

main()
  .catch((e) => {
    console.error('Seed Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
