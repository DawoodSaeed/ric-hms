import { Component } from '@angular/core';
import { PdfGeneratorComponent } from '../pdf-generator/pdf-generator.component';
@Component({
  selector: 'app-patient-checkin',
  imports: [PdfGeneratorComponent],
  templateUrl: './patient-checkin.component.html',
  styleUrl: './patient-checkin.component.scss'
})
export class PatientCheckinComponent {

}
