import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-pdf-generator',
  templateUrl: './pdf-generator.component.html',
  styleUrls: ['./pdf-generator.component.css'],
})
export class PdfGeneratorComponent {

generatePDF() {
  const doc = new jsPDF({
    orientation: 'portrait', // or "landscape"
    unit: 'mm', // Units: "mm", "cm", "in", "px"
    format: [150, 200], // Width: 150mm, Height: 200mm (custom size)
  });


  // Patient details
  const patientName = 'Mr. Alika (Regular)';
  const mrNo = '0401-25-000003';
  const cnic = '43166-5655765-7';
  const regDate = 'Mar 28, 2025';

  // Set font
  doc.setFont('Helvetica');

  // Centered Name (Bold)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold'); // Set font family and style properly
  const pageWidth = doc.internal.pageSize.getWidth();
  const textWidth = doc.getTextWidth(patientName);
  doc.text(patientName, (pageWidth - textWidth) / 2, 20);

  // Left-aligned labels and values
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold'); // Set font family and style properly
  let startY = 30;
  const marginX = 30;
  const lineSpacing = 10;

  doc.text('MR No:', marginX, startY);
  doc.text('CNIC:', marginX, startY + lineSpacing);
  doc.text('Reg. Date:', marginX, startY + lineSpacing * 2);

  // Corresponding values (Normal font)
  doc.setFont('helvetica', 'thin'); // Set font family and style properly
  doc.text(mrNo, marginX + 30, startY);
  doc.text(cnic, marginX + 30, startY + lineSpacing);
  doc.text(regDate, marginX + 30, startY + lineSpacing * 2);

  // Barcode image (Make sure you load it correctly)
  const barcodeImg = '/mnt/data/image.png'; // Update this path if needed
  // doc.addImage(barcodeImg, 'PNG', marginX, startY + 30, 80, 15);

  // Open PDF in new tab
  const pdfBlobUrl = doc.output('bloburl');
  window.open(pdfBlobUrl, '_blank');

  // Save PDF
  // doc.save('patient-registration.pdf');
}

}
