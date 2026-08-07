import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import fs from 'fs';
import path from 'path';

// 1. Generate Commercial Power & Solar Utility Invoice PDF
function createPowerInvoice() {
  const doc = new jsPDF();

  // Dark Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(16, 185, 129); // emerald-500
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PACIFIC GRID ENERGY & RENEWABLES', 14, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Commercial Utility & Carbon Audit Invoice', 14, 32);
  doc.text('Statement No: PGE-99824-2026 | Billing Date: 2026-08-07', 14, 39);

  // Billing Details Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 52, 182, 32, 3, 3, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ACCOUNT INFORMATION:', 20, 62);
  doc.setFont('helvetica', 'normal');
  doc.text('Customer Name: EcoMind Enterprise HQ', 20, 70);
  doc.text('Service Address: 450 Innovation Parkway, Suite 100', 20, 77);

  doc.setFont('helvetica', 'bold');
  doc.text('STATEMENT SUMMARY:', 120, 62);
  doc.setFont('helvetica', 'normal');
  doc.text('Billing Period: July 01 - July 31, 2026', 120, 70);
  doc.text('Total Amount Due: $342.80 (PAID)', 120, 77);

  // Resource Breakdown Table
  autoTable(doc, {
    startY: 92,
    head: [['Resource Meter Item', 'Meter Reading', 'Unit Quantity', 'GHG Scope Classification']],
    body: [
      ['Grid Electricity Usage', 'M-4821', '148.5 kWh', 'Scope 2 Location-Based Power'],
      ['Clean Solar Share Offset', 'SOLAR-01', '35 %', 'Renewable Energy Certificate'],
      ['Backup Diesel Fuel', 'GEN-02', '8.5 Liters', 'Scope 1 Stationary Fuel'],
      ['Employee Commute Transit', 'COMMUTE', '32.0 km', 'Scope 3 Business Commute'],
      ['Water Facility Supply', 'W-104', '280.0 Liters', 'Scope 3 Supply Chain Water'],
      ['Solid Waste Disposal', 'WST-88', '6.8 kg', 'Scope 3 Landfill Waste'],
      ['Waste Recycling Diversion', 'RECYC', '50 %', 'Materials Recovery Facility']
    ],
    theme: 'striped',
    headStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  // Footer Note
  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Certified Official Enterprise Utility Statement.', 14, finalY);
  doc.text('Ready for automated upload & extraction into EcoMind AI Sustainability Platform.', 14, finalY + 6);

  const outputPath = path.resolve('../SAMPLE_ENTERPRISE_POWER_INVOICE.pdf');
  fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
  console.log(`Created PDF: ${outputPath}`);
}

// 2. Generate Municipal Water & Waste Utility Bill PDF
function createWaterInvoice() {
  const doc = new jsPDF();

  // Dark Header Banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 45, 'F');

  doc.setTextColor(6, 182, 212); // cyan-500
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('METROPOLITAN MUNICIPAL UTILITIES', 14, 22);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Water Supply & Solid Waste Management Statement', 14, 32);
  doc.text('Account No: MMU-88210-2026 | Date: 2026-08-07', 14, 39);

  // Billing Details Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 52, 182, 32, 3, 3, 'FD');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('CUSTOMER DETAILS:', 20, 62);
  doc.setFont('helvetica', 'normal');
  doc.text('Account Holder: EcoMind Enterprise', 20, 70);
  doc.text('Facility Sector: Commercial Technology Hub', 20, 77);

  doc.setFont('helvetica', 'bold');
  doc.text('UTILITY SUMMARY:', 120, 62);
  doc.setFont('helvetica', 'normal');
  doc.text('Service Month: July 2026', 120, 70);
  doc.text('Total Utility Charge: $185.40', 120, 77);

  // Resource Breakdown Table
  autoTable(doc, {
    startY: 92,
    head: [['Utility Line Item', 'Meter ID', 'Measured Quantity', 'Environmental Classification']],
    body: [
      ['Commercial Water Supply', 'WM-902', '520.0 Liters', 'Clean Potable Water'],
      ['Municipal Waste Disposed', 'DISP-41', '14.2 kg', 'Solid Waste Landfill'],
      ['Waste Recycling Diversion', 'REC-12', '55 %', 'Recycled Cardboard/Plastic'],
      ['Facility Electricity Grid', 'EL-300', '72.0 kWh', 'Secondary Power Supply'],
      ['Fleet Generator Diesel', 'GEN-01', '6.0 Liters', 'Onsite Generator Fuel'],
      ['Transit Commute Log', 'BUS-09', '25.0 km', 'Public Metro Commute'],
      ['Renewable Solar Share', 'SOLAR-X', '30 %', 'Roof Solar PV System']
    ],
    theme: 'striped',
    headStyles: { fillColor: [6, 182, 212], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 9, cellPadding: 4 }
  });

  const finalY = doc.lastAutoTable.finalY + 15;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Official Municipal Water & Waste Management Statement.', 14, finalY);
  doc.text('Compatible with EcoMind AI OCR Document Extractor.', 14, finalY + 6);

  const outputPath = path.resolve('../SAMPLE_MUNICIPAL_WATER_WASTE_BILL.pdf');
  fs.writeFileSync(outputPath, Buffer.from(doc.output('arraybuffer')));
  console.log(`Created PDF: ${outputPath}`);
}

createPowerInvoice();
createWaterInvoice();
