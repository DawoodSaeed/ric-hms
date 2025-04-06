import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { PatientRegistration } from '../interfaces/patient.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Component } from '@angular/core';
import { jsPDF } from 'jspdf';
import JsBarcode from 'jsbarcode';
import { PanelOrg, PanelPackage } from '../interfaces/organisation';
@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + 'Patient';
  private panelOrgId = new BehaviorSubject<number>(1);
  panelOrgId$ = this.panelOrgId.asObservable();

  constructor() {}

  setPanelOrgId(orgId: number) {
    this.panelOrgId.next(orgId);
  }

  addPatient = (patient: PatientRegistration): Observable<any> => {
    return this.http.post<{ message: string; empid: number }>(
      `${this.apiUrl}/AddPatient`,
      patient
    );
  };

  getPatientByCnic = (cnic: string): Observable<PatientRegistration> => {
    return this.http
      .get<any>(`${this.apiUrl}/PatientByCNIC/${cnic}`)
      .pipe(map((response) => response.patient));
  };

  generatePDF(patientName: string, mrNo: string, cnic: string) {
    const doc = new jsPDF({
      orientation: 'portrait', // or "landscape"
      unit: 'mm', // Units: "mm", "cm", "in", "px"
      format: [150, 200], // Width: 150mm, Height: 200mm (custom size)
    });

    // Patient details
    const regDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

    console.log(regDate); // Example Output: "Mar 28, 2025"

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
    // Generate barcode using JsBarcode and add it to PDF
    const canvas = document.createElement('canvas'); // Create a temporary canvas
    JsBarcode(canvas, mrNo, {
      format: 'CODE128',
      displayValue: false, // Hide text below barcode
      width: 2, // Adjust width of bars
      height: 30, // Adjust height of barcode
    });

    // Convert canvas to base64 image and add it to PDF
    const barcodeDataUrl = canvas.toDataURL('image/png');
    doc.addImage(barcodeDataUrl, 'PNG', marginX, startY + 50, 80, 20); // Adjust position and size

    // Open PDF in new tab
    const pdfBlobUrl = doc.output('bloburl');
    window.open(pdfBlobUrl, '_blank');
  }

  getPanelOrg(): Observable<PanelOrg[]> {
    return this.http.get<PanelOrg[]>(`${this.apiUrl}/GetPanelOrg`).pipe(
      map((departments) =>
        departments
          .map((org) => ({
            ...org, // Spread existing properties
            id: org.porgId, // Add new property 'id'
          }))
          .filter((department: PanelOrg) => department.status === 1)
      )
    );
  }
  getPkgsOrgWise(): Observable<PanelPackage[]> {
    return this.panelOrgId$.pipe(
      tap((orgId) => console.log('orgID ', orgId)),
      switchMap((orgId: number) => {
        if (!orgId) return of([]);

        return this.http
          .get<PanelPackage[]>(`${this.apiUrl}/GetPanelPackages`)
          .pipe(
            map((response: PanelPackage[]) => response.filter((pkg: PanelPackage) => pkg.ppid === orgId)
            )
          );
      })
    );
  }
}
