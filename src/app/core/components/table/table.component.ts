import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ConfirmationService, Header, MessageService } from 'primeng/api';
import { Table, TableModule, TableRowSelectEvent } from 'primeng/table';
import { Bank, TypeTable } from '../../interfaces/typetable';
import { TypeTableService } from '../../services/type-table.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  switchMap,
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
import { Slider } from 'primeng/slider';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

interface ChargesType {
  id: number;
  name: string;
  description?: string;
  createdById?: number | null;
  createdOn?: string | null;
  modifiedById?: number | null;
  modifiedOn?: string | null;
  isActive?: number;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  standalone: true,
  imports: [
    CheckboxModule,
    Slider,
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
    BreadcrumbComponent,
  ],
  providers: [MessageService, ConfirmationService],
})
export class TableComponent implements OnInit, AfterViewInit {
  charges = signal<TypeTable[]>([]);
  pageTitle = signal('');
  isEdit = signal(false);
  // Signals...
  searchValue = signal('');
  data = signal<Bank[] | Building[] | Room[] | Bed[]>([]);

  buildings = signal<Building[]>([]);
  floors = signal<Floor[]>([]);
  branches = signal<Branch[]>([]);
  rooms = signal<Room[]>([]);
  beds = signal<Bed[]>([]);
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
  selectedRoom: Room | string = '';
  selectedCharges: TypeTable | string = '';

  minMaxRange: number[] = [20, 80];

  selectedBranchSubj = new BehaviorSubject<number>(0);
  selectedBuildingSubj = new BehaviorSubject<number>(0);
  selectedFloorSub = new BehaviorSubject<number>(0);
  selectedRoomSub = new BehaviorSubject<number>(0);
  // Utility function to get common fields

  // New floor object
  newFloor: Floor = {
    fid: 0,
    name: '',
    description: '',
    bid: 0,
    branchId: 1,
    status: 1,
    ...this.getCommonFields(),
  };

  // New building object
  newBuilding: Building = {
    bid: 0,
    name: '',
    description: '',
    status: 1,
    branchId: 1,
    ...this.getCommonFields(),
  };

  // New Room Object
  newRoom: Room = {
    rid: 0,
    name: '',
    description: '',
    bid: 0, //Building Id
    fid: 0, // Floor Id
    branchId: 1,
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
    branchId: 1, // Branch id
    priceId: 0,
    minValue: 0,
    maxValue: 0,
    isVacant: true,
    isFemale: true,
    status: 1,
    chargesType: 'Once',
    ...this.getCommonFields(),
  };

  currentDataType: 'floors' | 'buildings' | 'rooms' | 'beds' | null = null;
  tableColumns = signal<any[]>([]);
  dialogHeader = '';
  globalFilterFields = signal<string[]>([]);

  constructor(
    private typeTableService: TypeTableService,
    private route: ActivatedRoute,
    private router: Router,
    private branchService: BranchService,
    private cdr: ChangeDetectorRef,
    public confirmationService: ConfirmationService
  ) {}

  contextItems: any[] = [
    { icon: 'pi pi-eye', label: 'View' },
    {
      icon: 'pi pi-pencil',
      label: 'Edit',
      command: () => {
        console.log(this.selectedItem);
        this.displayDialog.set(true);
      },
    },
    {
      icon: 'pi pi-trash',
      label: 'Delete',
      command: () => {
        console.log('Working in the deletion procedure...');
        console.log(this.selectedItem);
        console.log('Clicked');
      },
    },
  ];

  buildings$!: Observable<Building[]>;
  buildingsObs$ = toObservable(this.buildings);

  floors$!: Observable<Floor[]>;
  floorObs$ = toObservable(this.floors);

  rooms$!: Observable<Room[]>;
  roomsObs$ = toObservable(this.rooms);

  chargesType$!: Observable<TypeTable[]>;

  ngOnInit(): void {
    // First, get data from snapshot to handle direct page loads (refresh scenario)
    const snapshotData = this.route.snapshot.data;
    if (snapshotData) {
      this.handleRouteData(snapshotData);
    }

    // Subscribe to route data for dynamic updates (when navigating within the app)
    this.route.data.subscribe((data) => {
      this.handleRouteData(data);
    });
  }

  // Function to handle route data
  private handleRouteData(data: any): void {
    const dataType = data['dataType'];
    const title = data['title'];

    if (title) {
      this.pageTitle.set(title);
    }

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
  }

  fetchBuildings() {
    this.branchService.getAllBuildings().subscribe((data) => {
      this.tableColumns.set([
        { field: 'bid', header: 'Building ID' },
        { field: 'name', header: 'Building Name' },
        { field: 'description', header: 'Description' },
      ]);
      this.globalFilterFields.set(this.tableColumns().map((col) => col.field));
      this.buildings.set(data);

      if (this.currentDataType === 'buildings') {
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

  fetchFloors() {
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

      if (this.currentDataType === 'floors') {
        this.data.set(data);
        this.loading.set(false);
      }
    });
  }

  fetchRooms() {
    this.branchService.getAllRooms().subscribe((data) => {
      console.log('Data from the api: ', data);
      this.tableColumns.set([
        { field: 'name', header: 'Room Name' },
        { field: 'description', header: 'Description' },
        { field: 'buildingName', header: 'Building Name' },
        { field: 'floorName', header: 'Floor Name' },
      ]);
      this.globalFilterFields.set(this.tableColumns().map((col) => col.field));
      this.rooms.set(data);

      if (this.currentDataType === 'rooms') {
        this.data.set(data);
        this.loading.set(false);
      }
    });
  }

  fetchBeds() {
    this.branchService.getAllBeds().subscribe((data) => {
      console.log('Data from the api: ', data);
      this.tableColumns.set([
        { field: 'name', header: 'Bed Name' },
        { field: 'buildingName', header: 'Bulding Name' },
        { field: 'floorName', header: 'Floor Name' },
        { field: 'roomName', header: 'Room Name' },
        { field: 'chargesType', header: 'Charges Type' },
      ]);
      this.globalFilterFields.set(this.tableColumns().map((col) => col.field));
      this.beds.set(data);
      if (this.currentDataType === 'beds') {
        this.data.set(data);
        this.loading.set(false);
      }
    });
  }

  showDialog() {
    this.displayDialog.set(true);
  }

  closeDialog() {
    this.displayDialog.set(false);
    this.onDialogDismiss();
  }

  addOrUpdateItem() {
    console.log('Working on edit ##########');
    // For adding the Building #################
    if (this.currentDataType == 'buildings') {
      console.log(this.newBuilding);
      this.newBuilding.status = this.newBuilding.status ? 1 : 0;
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
    else if (this.currentDataType == 'floors') {
      this.newFloor = {
        ...this.newFloor,
        branchId: this.selectedBranchSubj.value,
        bid: this.selectedBuildingSubj.value,
        status: this.newFloor.status ? 1 : 0,
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
    else if (this.currentDataType == 'rooms') {
      this.newRoom = {
        ...this.newRoom,
        bid: this.selectedBuildingSubj.value,
        fid: this.selectedFloorSub.value,
        branchId: this.selectedBranchSubj.value,
        status: this.newRoom.status ? 1 : 0,
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
    } else if (
      this.currentDataType === 'beds' &&
      typeof this.selectedCharges === 'object' &&
      this.selectedCharges.id &&
      typeof this.selectedRoom === 'object'
    ) {
      const [min, max] = this.minMaxRange;
      this.newBed = {
        ...this.newBed,
        branchId: this.selectedBranchSubj.value,
        bid: this.selectedBuildingSubj.value,
        fid: this.selectedFloorSub.value,
        rid: this.selectedRoomSub.value,
        priceId: this.selectedCharges.id,
        minValue: min,
        maxValue: max,
        status: this.newBed.status ? 1 : 0,
      };

      console.log('Submitting the bed form #############');
      console.log(this.newBed);

      this.branchService
        .createOrUpdateBed(this.newBed)
        .pipe(
          take(1),
          tap(() => {
            this.displayDialog.set(false), this.fetchData();
          })
        )
        .subscribe();
    } else {
      return;
    }

    // Reset EVerything...for the form values...
    this.onDialogDismiss();
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
    event: Branch | Building | Floor | Room,
    type: 'branch' | 'building' | 'floor' | 'room'
  ) {
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

      case 'room':
        const roomEvent = event as Room;
        this.selectedRoomSub.next(roomEvent.rid);
        break;
    }
  }

  deleteItemConfrimatin(rowData: any) {
    if (rowData) {
      this.selectedItem = rowData;
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this item?',
        header: 'Confirm Deletion',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.deleteItem();
        },
        reject: () => {
          this.confirmationService.close();
          console.log('Action canceled.');
          return;
        },
      });
    }
  }
  deleteItem() {
    console.log(this.selectedItem);

    if (this.currentDataType === 'beds') {
      const newItem = {
        ...this.selectedItem,
        status: 0,
      } as Bed;
      this.branchService.createOrUpdateBed(newItem).subscribe({
        next: () => {
          this.fetchData();
          this.confirmationService.close();
        },
      });
    } else if (this.currentDataType === 'rooms') {
      const newItem = {
        ...this.selectedItem,
        status: 0,
      } as Room;
      this.branchService.createOrUpdateRoom(newItem).subscribe({
        next: () => {
          this.fetchData();
          this.confirmationService.close();
        },
      });
    } else if (this.currentDataType === 'floors') {
      const newItem = {
        ...this.selectedItem,
        status: 0,
      } as Floor;
      this.branchService.createOrUpdateFloor(newItem).subscribe({
        next: () => {
          this.fetchData();
          this.confirmationService.close();
        },
      });
    } else if (this.currentDataType === 'buildings') {
      const newItem = {
        ...this.selectedItem,
        status: 0,
      } as Building;
      this.branchService.addOrUpdateBuilding(newItem).subscribe({
        next: () => {
          this.fetchData();
          this.confirmationService.close();
        },
      });
    }
  }

  // In your component.ts file
  editRow(rowData: any) {
    this.isEdit.set(true);
    // Implement your edit logic here.
    console.log('Editing row:', rowData);
    // Example: Set a flag to indicate that the row is being edited
    // and populate form fields with the row data.
    // this.editingRow = rowData;
    // this.form.patchValue(rowData);

    this.displayDialog.set(true);
    rowData.status = rowData.status ? true : false;
    if (this.currentDataType == 'beds') {
      this.newBed = rowData;
    } else if (this.currentDataType == 'buildings') {
      this.newBuilding = rowData;
    } else if (this.currentDataType === 'floors') {
      this.newFloor = rowData;
    } else if (this.currentDataType === 'rooms') {
      this.newRoom = rowData;
    }

    this.selectedCharges =
      this.charges().find((charge) => charge.name == rowData.chargesType) || '';

    // Assign min-max range if values exist
    if (rowData?.maxValue !== undefined && rowData?.minValue !== undefined) {
      this.minMaxRange = [rowData.maxValue, rowData.minValue];
    }

    // Filter branch if branchId exists
    this.selectedBranch = rowData?.branchId
      ? this.branches().find((branch) => {
          return branch.branchId === rowData.branchId;
        }) ?? ''
      : '';

    if (this.selectedBranch) {
      this.selectedBranchSubj.next(rowData.branchId);
    }

    // Filter building if bid exists
    this.selectedBuilding = rowData?.bid
      ? this.buildings().find((building) => building.bid === rowData.bid) ?? ''
      : '';

    if (this.selectedBuilding) {
      this.selectedBuildingSubj.next(rowData.bid);
    }

    // Filter floor if fid exists
    this.selectedFloor = rowData?.fid
      ? this.floors().find((floor) => floor.fid === rowData.fid) ?? ''
      : '';

    if (this.selectedFloor) {
      this.selectedFloorSub.next(rowData.fid);
    }

    // Filter room if rid exists
    this.selectedRoom = rowData?.rid
      ? this.rooms().find((room) => {
          console.log(room.rid, rowData.rid);
          return room.rid == rowData.rid;
        }) ?? ''
      : '';

    console.log(
      '##########################',
      this.rooms().find((room) => room.rid == rowData.rid),
      rowData.rid
    );

    if (this.selectedRoom) {
      this.selectedRoomSub.next(rowData.rid);
    }
  }

  // when the dialog dismiss reset to default values...
  onDialogDismiss() {
    console.log('Hide STage');
    // New floor object
    this.newFloor = {
      fid: 0,
      name: '',
      description: '',
      bid: 0,
      branchId: 1,
      status: 1,
      ...this.getCommonFields(),
    };

    // New building object
    this.newBuilding = {
      bid: 0,
      name: '',
      description: '',
      status: 1,
      branchId: 1,
      ...this.getCommonFields(),
    };

    // New Room Object
    this.newRoom = {
      rid: 0,
      name: '',
      description: '',
      bid: 0, //Building Id
      fid: 0, // Floor Id
      branchId: 1,
      status: 1,
      ...this.getCommonFields(),
    };

    // New Bed Object
    this.newBed = {
      bdId: 0,
      name: '',
      description: '',
      bid: 0, //Building Id
      fid: 0, // Floor Id
      rid: 0, // Room Id
      branchId: 1, // Branch id
      priceId: 0,
      minValue: 0,
      maxValue: 0,
      isVacant: true,
      isFemale: true,
      status: 1,
      chargesType: 'Once',
      ...this.getCommonFields(),
    };

    this.selectedBranch = '';
    this.selectedBuilding = '';
    this.selectedFloor = '';
    this.selectedRoom = '';
    this.selectedCharges = '';

    this.selectedBranchSubj.next(0);
    this.selectedBuildingSubj.next(0);
    this.selectedFloorSub.next(0);
    this.selectedRoomSub.next(0);

    this.minMaxRange = [20, 80];
    this.isEdit.set(false);
  }

  initializeStep() {
    // // Filtering logic for Buildings, Floors, and Rooms
    this.buildings$ = combineLatest([
      this.selectedBranchSubj,
      this.branchService
        .getAllBuildings()
        .pipe(tap((data) => this.buildings.set(data))),
    ]).pipe(
      map(([branchId, buildings]) =>
        branchId
          ? buildings.filter((building) => building.branchId == branchId)
          : buildings
      ),
      tap((data) =>
        console.log('Filtering of buildings based on Branch Id', data)
      )
    );

    // this.buildings$ = this.selectedBranchSubj.pipe(
    //   switchMap((branchId) =>
    //     this.branchService
    //       .getAllBuildings()
    //       .pipe(
    //         map((buildings) =>
    //           branchId
    //             ? buildings.filter((building) => building.branchId === branchId)
    //             : buildings
    //         )
    //       )
    //   ),
    //   tap((filteredBuildings) => {
    //     console.log(
    //       'Filtered buildings based on Branch ID:',
    //       filteredBuildings
    //     );
    //   })
    // );

    this.floors$ = combineLatest([
      this.selectedBuildingSubj,
      this.branchService
        .getAllFloors()
        .pipe(tap((data) => this.floors.set(data))),
    ]).pipe(
      map(([buildingId, floors]) =>
        buildingId ? floors.filter((floor) => floor.bid == buildingId) : floors
      ),
      tap((data) =>
        console.log('Filtering of floors based on Building Id', data)
      )
    );

    this.rooms$ = combineLatest([
      this.selectedFloorSub,
      this.branchService
        .getAllRooms()
        .pipe(tap((data) => this.rooms.set(data))),
    ]).pipe(
      map(([floorId, rooms]) =>
        floorId ? rooms.filter((room) => room.fid == floorId) : rooms
      ),
      tap((data) => console.log('Filtering of rooms based on Floor Id', data))
    );

    this.chargesType$ = this.typeTableService
      .getChargesTypes()
      .pipe(tap((data) => this.charges.set(data)));

    // this.floors$ = this.selectedBuildingSubj.pipe(
    //   switchMap((buildingId) =>
    //     this.branchService
    //       .getAllFloors()
    //       .pipe(
    //         map((floors) =>
    //           buildingId
    //             ? floors.filter((floor) => floor.bid === buildingId)
    //             : floors
    //         )
    //       )
    //   ),
    //   tap((filteredFloors) =>
    //     console.log('Filtered floors based on Building ID:', filteredFloors)
    //   )
    // );

    // this.rooms$ = this.selectedFloorSub.pipe(
    //   switchMap((floorId) =>
    //     this.branchService
    //       .getAllRooms()
    //       .pipe(
    //         map((rooms) =>
    //           floorId ? rooms.filter((room) => room.fid === floorId) : rooms
    //         )
    //       )
    //   ),
    //   tap((filteredRooms) =>
    //     console.log('Filtered rooms based on Floor ID:', filteredRooms)
    //   )
    // );
  }

  ngAfterViewInit(): void {
    this.initializeStep();
  }

  fetchData() {
    this.fetchBranches();
    if (this.currentDataType === 'buildings') {
      this.fetchBuildings();
    }
    if (this.currentDataType === 'floors') {
      this.fetchFloors();
    }
    if (this.currentDataType === 'rooms') {
      this.fetchRooms();
    }
    if (this.currentDataType === 'beds') {
      this.fetchBeds();
    }
  }
}
