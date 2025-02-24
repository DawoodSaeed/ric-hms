import {
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { Dialog } from 'primeng/dialog';
import { Ripple } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { SelectModule } from 'primeng/select';
import { Tag } from 'primeng/tag';
import { RadioButton } from 'primeng/radiobutton';
import { Rating } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { InputNumber } from 'primeng/inputnumber';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table } from 'primeng/table';
import { Bank } from '../../interfaces/typetable';
import { TypeTableService } from '../../services/type-table.service';
import { ContextMenuModule } from 'primeng/contextmenu';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'; // Import necessary modules
import { filter } from 'rxjs';

interface Cols {
  field: string;
  header: string;
  customExportHeader?: string;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    TableModule,
    Dialog,
    SelectModule,
    ToastModule,
    ToolbarModule,
    TextareaModule,
    CommonModule,
    InputTextModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ContextMenuModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class TableComponent implements OnInit {
  searchValue = signal('');
  banks = signal<Bank[]>([]);
  loading = signal(true);
  selectedItem: Bank | null = null;
  displayDialog = signal(false);
  newBank: Bank = {
    abbrivation: '',
    name: '',
    code: '',
    description: '',
    isActive: 1,
    bank: 0,
    id: 0,
  };

  firstPart: string = ''; // Variable to store 'organizational-building'
  secondPart: string = ''; // Variable to store 'beds'

  constructor(
    private typeTableService: TypeTableService,
    private route: ActivatedRoute, // Inject ActivatedRoute
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.fetchBanks();
    this.subscribeToRouterEvents(); // Call the function to subscribe to router events
  }

  fetchBanks() {
    this.typeTableService.getBanks().subscribe((data) => {
      const banksWithId = data.map((bank, index) => ({
        ...bank,
        id: bank.id || index,
      }));
      this.banks.set(banksWithId);
      this.loading.set(false);
    });
  }

  showDialog() {
    this.newBank = {
      abbrivation: '',
      name: '',
      code: '',
      description: '',
      isActive: 1,
      bank: 0,
      id: 0,
    };
    this.displayDialog.set(true);
  }

  closeDialog() {
    this.displayDialog.set(false);
  }

  addBank() {
    if (
      this.newBank.name &&
      this.newBank.abbrivation &&
      this.newBank.code &&
      this.newBank.description
    ) {
      this.typeTableService.addUpdateBank(this.newBank).subscribe(() => {
        this.fetchBanks();
        this.displayDialog.set(false);
      });
    }
  }

  items: any[] = [];

  contextItems = [
    {
      icon: 'pi pi-eye',
      label: 'View Employee',
    },
    {
      icon: 'pi pi-refresh',
      label: 'Refresh Employee',
    },
    {
      icon: 'pi pi-trash',
      label: 'Delete Employee',
    },
  ];

  clear(table: Table) {
    this.searchValue.set('');

    table.sortField = null;
    table.sortOrder = 1;
    table.multiSortMeta = null;

    table.clear();

    table.reset();

    const storageKey = table.stateKey ? `${table.stateKey}` : null;

    console.log(storageKey);
    if (storageKey) {
      sessionStorage.removeItem(storageKey);
    }

    table.onLazyLoad.emit({});
  }

  subscribeToRouterEvents() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlSegments = this.router.url.split('/');
        const lastSegments = urlSegments.slice(urlSegments.indexOf('organizational-building') + 1).join('/');

        if (lastSegments) {
          const parts = lastSegments.split('/');
          this.firstPart = parts[0];
          this.secondPart = parts[1] || ''; // Handle cases where there's only one part
        } else {
          this.firstPart = '';
          this.secondPart = '';
        }

        console.log('First Part:', this.firstPart);
        console.log('Second Part:', this.secondPart);
      });
  }
}