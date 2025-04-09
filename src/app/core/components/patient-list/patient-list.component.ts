import { Component, inject, OnInit } from '@angular/core';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { PatientService } from '../../services/patient.service';
import { tap } from 'rxjs';
@Component({
  selector: 'app-patient-list',
  imports: [DynamicTableComponent],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss'
})
export class PatientListComponent implements OnInit {
  private patientService=inject(PatientService)
  patientList:any[]=[]
  title:string='Patients List'
ngOnInit(): void {
  console.log('inside patientlist');
  this.patientService.getAllPatients().subscribe(patients=>{
    
    this.patientList = patients.map(({ name, gender, maritalStatus, cnic, dob })=>({
      name, gender, maritalStatus, cnic, dob
    }))
})
}
}
