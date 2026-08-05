import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export function exportReportToCSV(report) {
  const summary = report.summary_data || {};
  const entries = summary.entries || [];

  let csvContent = `data:text/csv;charset=utf-8,`;
  csvContent += `EcoMind AI Sustainability Audit Report\n`;
  csvContent += `Title,${report.title || 'Report'}\n`;
  csvContent += `Period,${report.start_date} to ${report.end_date}\n`;
  csvContent += `Total Net CO2 (kg),${summary.total_co2_kg || 0}\n`;
  csvContent += `Total Electricity (kWh),${summary.total_electricity_kwh || 0}\n`;
  csvContent += `Total Water (L),${summary.total_water_liters || 0}\n`;
  csvContent += `Total Waste (kg),${summary.total_waste_kg || 0}\n\n`;

  csvContent += `Date,Electricity (kWh),Water (L),Waste (kg),Fuel (L),Public Transport (km),Renewable %,Recycling %,CO2 (kg)\n`;

  entries.forEach(item => {
    csvContent += `${item.date},${item.electricity_kwh},${item.water_liters},${item.waste_kg},${item.fuel_liters},${item.public_transport_km},${item.renewable_energy_pct},${item.recycling_pct},${item.calculated_co2_kg}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${(report.title || 'sustainability_report').toLowerCase().replace(/\s+/g, '_')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportReportToPDF(report) {
  const doc = new jsPDF();
  const summary = report.summary_data || {};
  const entries = summary.entries || [];

  // Header Banner
  doc.setFillColor(6, 78, 59); // Deep Forest Green #064e3b
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('EcoMind AI – Sustainability Report', 14, 22);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleDateString()} | Type: ${report.type.toUpperCase()}`, 14, 32);

  // Summary Metrics Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('1. Executive Overview & Aggregates', 14, 52);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`• Report Title: ${report.title || 'Sustainability Audit'}`, 14, 60);
  doc.text(`• Total Net Carbon Footprint: ${summary.total_co2_kg || 0} kg CO2e`, 14, 67);
  doc.text(`• Electricity Consumption: ${summary.total_electricity_kwh || 0} kWh`, 14, 74);
  doc.text(`• Water Consumption: ${summary.total_water_liters || 0} Liters`, 14, 81);
  doc.text(`• Waste Generation: ${summary.total_waste_kg || 0} kg`, 14, 88);
  doc.text(`• Renewable Energy Share: ${summary.avg_renewable_pct || 0}%`, 110, 60);
  doc.text(`• Recycling Diversion Rate: ${summary.avg_recycling_pct || 0}%`, 110, 67);
  doc.text(`• Daily Average Emissions: ${summary.daily_avg_co2 || 0} kg/day`, 110, 74);

  // Detail Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('2. Daily Resource Logs', 14, 102);

  const tableColumn = ['Date', 'Elec (kWh)', 'Water (L)', 'Waste (kg)', 'Fuel (L)', 'Transit (km)', 'CO2 (kg)'];
  const tableRows = entries.map(item => [
    item.date,
    item.electricity_kwh,
    item.water_liters,
    item.waste_kg,
    item.fuel_liters,
    item.public_transport_km,
    item.calculated_co2_kg,
  ]);

  doc.autoTable({
    startY: 108,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillStyle: 'F', fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 9 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`EcoMind AI Smart Sustainability Assistant - Page ${i} of ${pageCount}`, 14, doc.internal.pageSize.height - 10);
  }

  doc.save(`${(report.title || 'sustainability_report').toLowerCase().replace(/\s+/g, '_')}.pdf`);
}
