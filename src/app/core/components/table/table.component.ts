import {
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, Header, MessageService } from 'primeng/api';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { Bank } from '../../interfaces/typetable';
import { TypeTableService } from '../../services/type-table.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  Observable,
  take,
  tap,
} from 'rxjs';
import { BranchService } from '../../services/branch.service';
import {
  Bed,
  Branch,
  Building,
  Floor,
  Room,
} from '../../interfaces/branch.interface';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { TagModule } from 'primeng/tag';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { InputNumberModule } from 'primeng/inputnumber';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form.component';
import { DynamicTableComponent } from '../../../components/dynamic-table/dynamic-table.component';
import { SelectModule } from 'primeng/select';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    SelectModule,
    TableModule,
    DialogModule,
    DropdownModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialogModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    FileUploadModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    ContextMenuModule,
    TagModule,
    RadioButtonModule,
    RatingModule,
    InputNumberModule,
  ],
  providers: [MessageService, ConfirmationService],
})
export class TableComponent implements OnInit {
  // Signals...
  searchValue = signal('');
  data = signal<Bank[] | Building[] | Room[] | Bed[]>([]);

  buildings = signal<Building[]>([]);
  floors = signal<Floor[]>([]);
  branches = signal<Branch[]>([]);

  dropdownFloors = combineLatest([
    toObservable(this.buildings),
    toObservable(this.floors),
  ]);

  loading = signal(true);
  displayDialog = signal(false);

  // Normal Variables...
  selectedItem: any;
  selectedRow!: Bank | Building | Room | Bed;

  selectedBuilding: Building | string = '';
  selectedFloor: Floor | string = '';
  selectedBranch: Branch | string = '';

  selectedBranchSubj = new BehaviorSubject<number>(0);
  selectedBuildingSubj = new BehaviorSubject<number>(0);
  selectedFloorSub = new BehaviorSubject<number>(0);
  // Utility function to get common fields

  // New floor object
  newFloor: Floor = {
    fid: 0,
    name: '',
    description: '',
    bid: 0,
    branchId: 0,
    status: 1,
    ...this.getCommonFields(),
  };

  // New building object
  newBuilding: Building = {
    bid: 0,
    name: '',
    description: '',
    status: 1,
    branchId: 0,
    ...this.getCommonFields(),
  };

  // New Room Object
  newRoom: Room = {
    rid: 0,
    name: '',
    description: '',
    bid: 0, //Building Id
    fid: 0, // Floor Id
    branchId: 0,
    status: 1,
    ...this.getCommonFields(),
  };

  // New Bed Object
  newBed: Bed = {
    bdId: 0,
    name: '',
    description: '',
    bid: 0, //Building Id
    fid: 0, // Floor Id
    rid: 0, // Room Id
    branchId: 0, // Branch id
    priceId: 0,
    minValue: 0,
    maxValue: 0,
    isVacant: true,
    isFemale: true,
    status: 1,
    ...this.getCommonFields(),
  };

  currentDataType: 'floors' | 'buildings' | 'rooms' | 'beds' | null = null;
  tableColumns = signal<any[]>([]);
  dialogHeader = '';
  globalFilterFields = signal<string[]>([]);
  contextItems: any[] = [
    { icon: 'pi pi-eye', label: 'View' },
    {
      icon: 'pi pi-pencil',
      label: 'Edit',
      command: () => {
        console.log(this.selectedItem);
      },
    },
    {
      icon: 'pi pi-trash',
      label: 'Delete',
      command: () => {
        console.log('Clicked');
      },
    },
  ];

  constructor(
    private typeTableService: TypeTableService,
    private route: ActivatedRoute,
    private router: Router,
    private branchService: BranchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const dataType = data['dataType']; // Get dataType from route data
      if (dataType && this.isValidDataType(dataType)) {
        this.currentDataType = dataType as
          | 'floors'
          | 'buildings'
          | 'rooms'
          | 'beds';

        this.fetchData();
      } else {
        console.error('Invalid dataType:', dataType);
      }
    });

    this.fetchBuildings(undefined);
    this.fetchFloors(undefined);
    this.fetchBranches();

    // This will filter the dropdown values
    combineLatest([
      this.selectedBranchSubj,
      this.selectedBuildingSubj,
    ]).subscribe(([branchId, buildingId]) => {
      // if branch id is greater then 1 we need t filter the buildings.
      if (branchId) {
        this.buildings.update((currentBuildings) =>
          currentBuildings.filter((building) => building.branchId == branchId)
        );
      }

      if (buildingId) {
        this.floors.update((currentFloors) =>
          currentFloors.filter((floor) => floor.bid == buildingId)
        );
      }
    });
  }

  fetchBuildings(params: undefined | 'set') {
    this.branchService.getAllBuildings().subscribe((data) => {
      this.tableColumns.set([
        { field: 'bid', header: 'Building ID' },
        { field: 'name', header: 'Building Name' },
        { field: 'description', header: 'Description' },
      ]);
      this.globalFilterFields.set(this.tableColumns().map((col) => col.field));
      this.buildings.set(data);

      if (params) {
        this.data.set(data);
        this.loading.set(false);
      }
    });
  }

  fetchBranches() {
    this.branchService.getAllBranches().subscribe((data) => {
      this.branches.set(data);
    });
  }

  fetchFloors(params: undefined | 'set') {
    this.branchService.getAllFloors().subscribe((data) => {
      console.log('Data from the api: ', data);
      this.tableColumns.set([
        { field: 'buildingName', header: 'Building Name' },
        { field: 'name', header: 'Floor Name' },
        { field: 'description', header: 'Floor Description' },
        { field: 'branchName', header: 'Branch Name' },
      ]);
      this.globalFilterFields.set(this.tableColumns().map((col) => col.field));
      this.floors.set(data);

      if (params) {
        this.data.set(data);
        this.loading.set(false);
      }
    });
  }

  fetchData() {
    this.loading.set(true);
    switch (this.currentDataType) {
      case 'floors':
        this.fetchFloors('set');
        break;
      case 'buildings':
        this.fetchBuildings('set');
        break;
      case 'rooms':
        this.branchService.getAllRooms().subscribe((data) => {
          console.log('Data from the api: ', data);
          this.tableColumns.set([
            { field: 'name', header: 'Room Name' },
            { field: 'description', header: 'Description' },
            { field: 'branchName', Header: 'Branch Name' },
            { field: 'buildingName', header: 'Building Name' },
            { field: 'floorName', header: 'Floor Name' },
          ]);
          this.globalFilterFields.set(
            this.tableColumns().map((col) => col.field)
          );
          this.data.set(data); // Set the data signal
          this.loading.set(false);
          this.cdr.markForCheck();
        });
        break;
      case 'beds':
        this.branchService.getAllBeds().subscribe((data) => {
          console.log('Data from the api: ', data);
          this.tableColumns.set([
            { field: 'id', header: 'Bed ID' },
            { field: 'name', header: 'Bed Name' },
            { field: 'description', header: 'Description' },
            { field: 'isActive', header: 'Status' },
          ]);
          this.globalFilterFields.set(
            this.tableColumns().map((col) => col.field)
          );
          this.data.set(data); // Set the data signal
          this.loading.set(false);
          this.cdr.markForCheck();
        });
        break;
    }
  }

  showDialog() {
    this.displayDialog.set(true);
  }

  closeDialog() {
    this.displayDialog.set(false);
  }

  addOrUpdateItem() {
    // For adding the Building #################
    if (this.currentDataType == 'buildings') {
      this.branchService
        .addOrUpdateBuilding(this.newBuilding)
        .pipe(
          take(1),
          tap(() => {
            this.displayDialog.set(false), this.fetchData();
          })
        )
        .subscribe();
    }

    // For adding the Floor #################
    else if (
      this.currentDataType == 'floors' &&
      typeof this.selectedBuilding === 'object'
    ) {
      this.newFloor = {
        ...this.newFloor,
        branchId: this.selectedBranchSubj.value,
        bid: this.selectedBuildingSubj.value,
      };
      this.branchService
        .createOrUpdateFloor(this.newFloor)
        .pipe(
          take(1),
          tap(() => {
            this.displayDialog.set(false), this.fetchData();
          })
        )
        .subscribe();
    }

    // For adding the room #################
    else if (
      this.currentDataType == 'rooms' &&
      typeof this.selectedBuilding === 'object' &&
      typeof this.selectedFloor === 'object'
    ) {
      this.newRoom = {
        ...this.newRoom,
        bid: this.selectedBuildingSubj.value,
        fid: this.selectedFloorSub.value,
        branchId: this.selectedBranchSubj.value,
      };
      this.branchService
        .createOrUpdateRoom(this.newRoom)
        .pipe(
          take(1),
          tap(() => {
            this.displayDialog.set(false), this.fetchData();
          })
        )
        .subscribe();
    }
  }

  clear(table: Table) {
    table.clear();
  }

  getAddButtonLabel(): string {
    switch (this.currentDataType) {
      case 'floors':
        return 'Add Floor';
      case 'buildings':
        return 'Add Building';
      case 'rooms':
        return 'Add Room';
      case 'beds':
        return 'Add Bed';
      default:
        return 'Add';
    }
  }

  getDialogHeader(): string {
    switch (this.currentDataType) {
      case 'floors':
        return 'Add New Floor';
      case 'buildings':
        return 'Add New Building';
      case 'rooms':
        return 'Add New Room';
      case 'beds':
        return 'Add New Bed';
      default:
        return 'Add New Item';
    }
  }

  isValidDataType(dataType: string): boolean {
    return ['floors', 'buildings', 'rooms', 'beds'].includes(dataType);
  }

  getCommonFields() {
    const timestamp = new Date().toISOString();
    return {
      createdById: 0,
      createdOn: timestamp,
      modifiedById: 0,
      modifiedOn: timestamp,
    };
  }

  onSelectedRow(event: any) {
    this.selectedRow = event.data;
    console.log('Selected Row:', this.selectedRow);
    console.log('Type of selectedRow:', typeof this.selectedRow);
    console.log('Is selectedRow an array:', Array.isArray(this.selectedRow));
  }

  onDropdownChange(
    event: Branch | Building | Floor,
    type: 'branch' | 'building' | 'floor'
  ) {
    console.log(event, type);
    switch (type) {
      case 'branch':
        const branchEvent = event as Branch; // Type assertion
        this.selectedBranchSubj.next(branchEvent.branchId);
        break;

      case 'building':
        const buildingEvent = event as Building;
        this.selectedBuildingSubj.next(buildingEvent.bid);
        break;

      case 'floor':
        const floorEvent = event as Floor;
        this.selectedFloorSub.next(floorEvent.fid);
        break;
    }
  }
}
