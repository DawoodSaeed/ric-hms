import { Component, computed, EventEmitter, inject, Inject, Input, OnInit, Output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Tag } from 'primeng/tag';
import { EmployeeService } from '../../core/services/employee.service';
import { SpeedDial } from 'primeng/speeddial';

@Component({
  selector: 'app-dynamic-table',
  imports: [TableModule, CommonModule, IconFieldModule, InputIconModule, Tag,SpeedDial],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
})
export class DynamicTableComponent implements OnInit {
  constructor(){
  }
  
  

  getActionItems(employee: any) {
    return [
        { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editRow(employee) },
        { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteItem(employee) }
    ];
}
  @Input() tableData: any[] = [];
  @Input() tableTitle: string = '';
  @Output() dataEmitter=new EventEmitter<any>()
  ngOnInit(): void {}
  getKeys(): any[] {
    return this.tableData.length > 0
      ? Object.keys(this.tableData[0]).filter(
          (key) =>
            ![
              'createdById',
              'createdOn',
              'modifiedById',
              'modifiedOn',
              'empId',
              'bankId',
              'isCurrent',
              'status'
            ].includes(key)
        )
      : [];
  }
  editRow(employee: any) {
    console.log('Editing Employee:', employee);
    this.dataEmitter.emit(employee)
}

deleteItem(employee: any) {
    console.log('Deleting Employee:', employee);
    // Your delete logic here
}
  formatStringName(name: string): string {
    if (name === 'empAwrdId') {
      return 'Award ID';
    }
    return name
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Insert space before uppercase letters
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle multiple uppercase letters
      .replace(/\b[a-z]/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
  }
  formatStatus(value: number, key: string): any {
    if (key === 'status') {
      return {
        label: value === 0 ? 'Active' : 'In-Active',
        severity: value === 0 ? 'success' : 'danger',
      };
    }
    return value;
  }
}
