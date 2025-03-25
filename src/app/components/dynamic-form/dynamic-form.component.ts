import {
  Component,
  computed,
  inject,
  Inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormGroup, FormsModule, FormControl } from '@angular/forms';
import { FormStructure } from '../../core/interfaces/dynamicforminterface';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TabsModule } from 'primeng/tabs';
import { Select } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { EventEmitter } from '@angular/core';
import { RadioButton } from 'primeng/radiobutton';
import { FileUploadModule } from 'primeng/fileupload';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { ProgressSpinner } from 'primeng/progressspinner';
import { NOTYF } from './../../shared/utils/notyf.token';
import { Notyf } from 'notyf';
import { EmployeeService } from '../../core/services/employee.service';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from 'primeng/message';
import { TypeTableService } from '../../core/services/type-table.service';
import { OrganisationService } from '../../core/services/organisation.service';

@Component({
  selector: 'app-dynamic-form',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    TabsModule,
    Select,
    InputTextModule,
    CalendarModule,
    RadioButton,
    FileUploadModule,
    ProgressSpinner,
    DynamicTableComponent,
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
})
export class DynamicFormComponent implements OnInit {
  @Input() formStructure!: FormStructure;
  @Output() dataEmitter = new EventEmitter<any>();
  @Input() isLoading: boolean = false;
  dropdownService = inject(TypeTableService);
  organizationService = inject(OrganisationService);

  dataReceivedFromChild: any = null;
  entriesCount: number = 2;
  isEdit: boolean = false;
  isDelete: boolean = false;
  form!: FormGroup;
  uploadedImages: { [key: string]: string | ArrayBuffer } = {};
  selectedTabIndex: number = 0;
  currentTab = signal('');
  private emplyeeService = inject(EmployeeService);
  registeredEmpID = computed(() => this.emplyeeService.registeredEmpIDSignal());
  receivedEmployee: any;
  uploadedFiles: { [key: string]: File } = {};
  constructor(
    private location: Location, // Inject Location Service
    private dynamicFormService: DynamicFormService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    console.log('Form Structure:', this.formStructure);

    this.form = this.dynamicFormService.createForm(this.formStructure);
    if (this.formStructure.tabs) {
      this.currentTab.set(this.formStructure.tabs[0].tabName);
    }
    const receivedEmployee = history.state.employee;
    console.log('Received Employee:', receivedEmployee);
    if (receivedEmployee) {
      // Yahan pr apis call krani hein
      this.emplyeeService.setRegisteredEmpID(receivedEmployee.empId);
      this.receivedEmployee = receivedEmployee;
      this.form.patchValue(receivedEmployee);
      this.dataReceivedFromChild = null;

      this.isEdit = true;
      this.isDelete = false;

      //  Clear `history.state` after processing
      setTimeout(() => {
        this.location.replaceState('/admin/addEmployee'); // Replace state with an empty URL
      }, 0);
    }
  }
  onValueChange(value: number | string, field: string) {
    console.log('field ', field);
    console.log('value ', value);
    if (field === 'country' && typeof value === 'number') {
      this.dropdownService.setCountryID(value);
    }
    if (field === 'province' && typeof value === 'number') {
      this.dropdownService.setProvinceID(value);
    }
    if (field === 'did' && typeof value === 'number') {
      this.organizationService.setDepartmentID(value);
    }
    if (field === 'spId' && typeof value === 'number') {
      this.dropdownService.setSpecialityID(value);
    }
  }

  receivedDataFromOwnTable(data: any) {
    console.log('receivedDataFromOwnTable ', data);
    if (data.isDelete) {
      this.dataReceivedFromChild = data.employee;
      this.isDelete = true;
      this.isEdit = false;
      this.onSubmit();
    } else {
      this.dataReceivedFromChild = data;
      this.isEdit = true;
      this.isDelete = false;
      if (this.form) {
        Object.keys(data).forEach((key: any) => {
          if (this.form.controls[key]) {
            this.form.controls[key].setValue(data[key]);
          }
        });
      }
    }
  }
  onTabChange(event: any) {
    // this.form.patchValue(this.receivedEmployee);

    console.log('calling onTabChange');
    console.log('change event ', event);
    this.selectedTabIndex = event; // Update selected tab index
    if (this.formStructure.tabs) {
      this.currentTab.set(
        this.formStructure.tabs[this.selectedTabIndex].tabName
      );
    }
    this.dataReceivedFromChild = null;
    this.isEdit = false;
  }
  onImageUpload(event: any, fieldName: string) {
    // PrimeNG file upload returns files in event.files array
    const file: File = event.files[0];

    if (file) {
      const reader = new FileReader();

      // On file load, convert to base64 string
      reader.onload = () => {
        const base64String = reader.result as string;

        // Store base64 in uploadedImages for preview
        this.uploadedImages[fieldName] = base64String;

        // Store base64 string in the form control
        this.form.get(fieldName)?.setValue(base64String);
      };

      // Read the file as a Data URL (base64)
      reader.readAsDataURL(file);
    }
  }

  onDateSelect(event: any, fieldName: string) {
    console.log(event);
    const date = new Date(event);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2-digit day

    const formattedDate = `${year}-${month}-${day}`;
    this.form.get(fieldName)?.setValue(formattedDate);
  }

  onSubmit(): void {
    if (this.formStructure?.tabs) {
      const selectedTab = this.formStructure.tabs[this.selectedTabIndex];
      if (!selectedTab) return; // Safety check
      let tabData: any = {};
      let isValid = true;
  if(!this.isDelete){
    // Validate only the fields of the selected tab
    selectedTab.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const control = this.form.get(field.name);
        if (control) {
          control.markAsTouched(); // Mark only current tab fields as touched
          tabData[field.name] = control.value;
          
          if (control.invalid) {
            isValid = false; // Set validation flag if invalid
          }
        }
      });
    });
  }
      if (isValid) {
        const apiToCall = selectedTab.apiToCall;
  
        console.log('Selected Tab:', selectedTab);
        console.log('Tab Data:', tabData);
  
        if (this.isEdit && this.dataReceivedFromChild) {
          tabData = Object.assign(
            tabData,
            Object.fromEntries(
              Object.entries(this.dataReceivedFromChild).filter(
                ([key]) => !(key in tabData)
              )
            )
          );
        }
        if (this.isDelete) {
          tabData = this.dataReceivedFromChild;
        }
        this.dataEmitter.emit({
          apiToCall,
          data: tabData,
          isEdit: this.isEdit,
          isDelete: this.isDelete,
        });
  if( !this.isDelete && selectedTab.tabName!=='Basic Info'){
    console.log('selected Tab ',selectedTab);
     // Validate only the fields of the selected tab
     selectedTab.sections.forEach((section) => {
      section.fields.forEach((field) => {
        const control = this.form.get(field.name);
        if (control) {
          control.setValue('')
          control.markAsPristine(); // Reset validation state
          control.markAsUntouched();
         
        }
      });
    });

  }
        this.isEdit = false;
        this.isDelete = false;
      } else {
        this.notificationService.showError('Please fill all required fields');
      }
    }
  }
  
  onFileUpload(event: any, fieldName: string) {
    console.log('Field name:', fieldName);
    const file = event.files?.[0];
  
    if (file) {
      console.log('File uploaded:', file);
      this.uploadedFiles[fieldName] = file;
  
      // ✅ Now dynamically set the file path to the correct form field
      this.form.get(fieldName)?.setValue(this.uploadedFiles);
    } else {
      console.warn('No file uploaded');
    }
  }
  
  
}
