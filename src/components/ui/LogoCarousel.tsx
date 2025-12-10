'use client';

import { Building2, Landmark, Briefcase, Scale, Calculator, Building } from 'lucide-react';

// Placeholder company data - in production, this would come from a CMS or database
const companies = [
  { name: 'Despacho García y Asociados', icon: Building2 },
  { name: 'Contadores MX', icon: Landmark },
  { name: 'Fiscal Empresarial', icon: Briefcase },
  { name: 'Auditoría Profesional', icon: Scale },
  { name: 'Tax Solutions', icon: Calculator },
  { name: 'Grupo Contable Norte', icon: Building },
  { name: 'Servicios Fiscales Pro', icon: Building2 },
  { name: 'Despacho Martínez', icon: Landmark },
];

export function LogoCarousel() {
  // Duplicate companies for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies];

  return (
    <div className="relative overflow-hidden">
      {/* Gradient masks for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      {/* Scrolling container */}
      <div className="flex animate-scroll-left">
        {duplicatedCompanies.map((company, index) => {
          const Icon = company.icon;
          return (
            <div
              key={`${company.name}-${index}`}
              className="flex items-center gap-3 px-8 py-4 flex-shrink-0 group cursor-pointer"
            >
              <div className="grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                <Icon className="h-8 w-8 text-gray-600 group-hover:text-brand-600 transition-colors" />
              </div>
              <span className="font-semibold text-gray-400 group-hover:text-gray-700 transition-colors whitespace-nowrap">
                {company.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
