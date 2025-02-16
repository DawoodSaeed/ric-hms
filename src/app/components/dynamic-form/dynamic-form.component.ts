import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { FormStructure } from '../../core/interfaces/dynamicform';
import { DynamicFormService } from '../../core/services/dynamic-form.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-dynamic-form',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent {
  @Input() formStructure!: FormStructure;
  form!: FormGroup;

  constructor(private dynamicFormService: DynamicFormService) {}

  ngOnInit(): void {
    this.form = this.dynamicFormService.createForm(this.formStructure);
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
