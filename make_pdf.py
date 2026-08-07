import os

def create_pdf(filename, title, invoice_num, elec, water, waste, fuel, transit, solar, recycling, total_usd):
    stream_content = f"""BT
/F1 18 Tf
50 740 Td
({title.upper()}) Tj
0 -25 Td
/F1 11 Tf
(Commercial Utility & Carbon Audit Invoice #{invoice_num}) Tj
0 -25 Td
(Billing Date: 2026-08-07 | Service Period: July 01 - July 31, 2026) Tj
0 -20 Td
(Customer: EcoMind Enterprise HQ - Account #8849-2026-ESG) Tj
0 -35 Td
/F1 13 Tf
(RESOURCE CONSUMPTION & GHG SCOPE METRICS:) Tj
0 -25 Td
/F1 11 Tf
(1. Grid Electricity Usage:    {elec} kWh    [Scope 2 Power Grid]) Tj
0 -20 Td
(2. Clean Solar Share Offset:  {solar} %         [Renewable Solar REC]) Tj
0 -20 Td
(3. Generator Diesel Fuel:     {fuel} Liters   [Scope 1 Stationary Combustion]) Tj
0 -20 Td
(4. Employee Metro Commute:    {transit} km      [Scope 3 Employee Commute]) Tj
0 -20 Td
(5. Water Facility Supply:     {water} Liters [Scope 3 Potable Water]) Tj
0 -20 Td
(6. Solid Waste Disposed:      {waste} kg       [Scope 3 Landfill Waste]) Tj
0 -20 Td
(7. Waste Recycling Rate:      {recycling} %         [Materials Recovery Facility]) Tj
0 -35 Td
/F1 12 Tf
(Total Amount Due: ${total_usd} - PAID IN FULL) Tj
0 -20 Td
(Verified ESG Audit Statement for EcoMind AI OCR Document Upload) Tj
ET
"""
    stream_bytes = stream_content.encode("latin-1")
    stream_len = len(stream_bytes)

    pdf_structure = f"""%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>
endobj
4 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
5 0 obj
<< /Length {stream_len} >>
stream
{stream_content}endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000315 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
{315 + stream_len + 50}
%%EOF
"""

    out_path = os.path.abspath(filename)
    with open(out_path, "wb") as f:
        f.write(pdf_structure.encode("latin-1"))
    print(f"Generated PDF: {out_path}")

if __name__ == "__main__":
    create_pdf("1_COMMERCIAL_POWER_SOLAR_INVOICE.pdf", "Pacific Grid Energy & Solar Corp", "PGE-99824-2026", 148.5, 280.0, 6.8, 8.5, 32.0, 45, 50, "342.80")
    create_pdf("2_MUNICIPAL_WATER_RECYCLING_BILL.pdf", "Metropolitan Municipal Water & Waste", "MMU-88210-2026", 72.0, 520.0, 14.2, 6.0, 25.0, 30, 55, "185.40")
    create_pdf("3_ENTERPRISE_FLEET_ESG_STATEMENT.pdf", "Global Enterprise ESG Audit Services", "ESG-77401-2026", 210.0, 680.0, 19.5, 18.5, 48.0, 38, 65, "620.00")
