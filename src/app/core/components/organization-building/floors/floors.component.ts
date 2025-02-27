import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchService } from '../../../services/branch.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
export interface Cols {
  field: string;
  header: string;
}

export interface FormField {
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number';
  field?: string;
  options?: any[];
}

export interface Config {
  title: string;
  columns: Cols[];
  formFields: FormField[];
  api: {
    get: string;
    add: string;
    update: string;
    delete: string;
  };
  dataKey: string;
}

@Component({
  selector: 'app-floors',
  templateUrl: './floors.component.html',
  standalone: true,
  imports: [
    InputIconModule,
    IconFieldModule,
    InputGroupModule,
    InputGroupAddonModule,
    CommonModule,
    FormsModule,
    TableModule,
    DialogModule,
    DropdownModule,
    ToastModule,
    ToolbarModule,
    TextareaModule,
    InputTextModule,
    InputNumberModule,
    ButtonModule,
    ContextMenuModule,
    ConfirmDialogModule,
    FormsModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class FloorsComponent implements OnInit {
  @Input() config!: Config;

  searchValue = signal('');
  data = signal<any[]>([]);
  loading = signal(true);
  selectedItem: any | null = null;
  displayDialog = signal(false);
  newItem: any = {};

  constructor(
    private branchService: BranchService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.branchService.getAllFloors().subscribe((data) => {
      this.data.set(data);
      this.loading.set(false);
    });
  }

  showDialog(item?: any) {
    this.newItem = item ? { ...item } : {};
    this.displayDialog.set(true);
  }

  closeDialog() {
    this.displayDialog.set(false);
  }

  saveData() {
    if (this.newItem.id) {
      this.branchService.createOrUpdateFloor(this.newItem).subscribe(() => {
        this.fetchData();
        this.displayDialog.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Floor updated successfully',
        });
      });
    } else {
      this.branchService.createOrUpdateFloor(this.newItem).subscribe(() => {
        this.fetchData();
        this.displayDialog.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Floor added successfully',
        });
      });
    }
  }

  deleteData(item: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this floor?',
      accept: () => {
      
      },
    });
  }

  contextItems = [
    {
      icon: 'pi pi-pencil',
      label: 'Edit',
      command: (event: any) => this.showDialog(event.item),
    },
    {
      icon: 'pi pi-trash',
      label: 'Delete',
      command: (event: any) => this.deleteData(event.item),
    },
  ];

  clear(table: any) {
    this.searchValue.set('');
    table.clear();
    table.reset();
    sessionStorage.removeItem(table.stateKey);
    table.onLazyLoad.emit({});
  }

  getFilterFields(): string[] {
    return this.config.columns.map((col) => col.field);
  }
}
