import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample downloads
  const downloads = await Promise.all([
    prisma.download.upsert({
      where: { id: 'download-1' },
      update: {},
      create: {
        id: 'download-1',
        version: '1.0.0',
        filename: 'ContPAQi-AI-Bridge-Setup.exe',
        size: 85000000, // ~85MB
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        releaseDate: new Date('2025-12-01'),
        changelog: `
## Version 1.0.0 - Initial Release

### Features
- AI-powered invoice data extraction from PDF files
- Support for Mexican CFDi (Comprobante Fiscal Digital)
- RFC (Registro Federal de Contribuyentes) validation
- IVA (Impuesto al Valor Agregado) automatic calculation
- Confidence scoring for extracted data
- Batch processing for multiple invoices
- Direct integration with ContPAQi Comercial
- English and Spanish interface

### Requirements
- Windows 10 or later
- .NET Framework 4.8
- Docker Desktop (for AI processing)
- ContPAQi Comercial 2023 or later
        `.trim(),
        isLatest: true,
        downloadUrl: '/downloads/ContPAQi-AI-Bridge-Setup.exe',
      },
    }),
    prisma.download.upsert({
      where: { id: 'download-2' },
      update: {},
      create: {
        id: 'download-2',
        version: '1.0.0',
        filename: 'ContPAQi-AI-Bridge-Setup-Silent.exe',
        size: 85000000,
        checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        releaseDate: new Date('2025-12-01'),
        changelog: 'Silent installer for enterprise deployments. Same features as standard installer.',
        isLatest: false,
        downloadUrl: '/downloads/ContPAQi-AI-Bridge-Setup-Silent.exe',
      },
    }),
  ]);

  console.log(`✅ Created ${downloads.length} download entries`);

  // Note: In production, you would NOT seed admin users this way
  // This is just for development/demonstration purposes
  if (process.env.NODE_ENV === 'development' || process.env.SEED_DEMO_DATA === 'true') {
    console.log('📊 Development mode: Skipping demo user creation');
    console.log('   To create demo data, use the admin panel or registration flow');
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
