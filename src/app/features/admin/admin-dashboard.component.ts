import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypetableManagerComponent } from '../../core/components/typetable/typetable.component';
// import { SidebarService } from '../../core/services/sidebar.service';
import {
  Cols,
  FormField,
  Config,
  FloorsComponent,
} from '../../core/components/organization-building/floors/floors.component'; // Adjust path

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  styleUrl: './admin-dashboard.component.scss',
  templateUrl: './admin-dashboard.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {
  // floors-config.ts (or wherever you define your config objects)

  floorsConfig: Config = {
    title: 'Floors',
    dataKey: 'fid', // Assuming 'fid' is the unique identifier for floors
    columns: [
      { field: 'name', header: 'Floor' },
      { field: 'description', header: 'Description' },
      { field: 'bid', header: 'Building' }, // Assuming 'bid' represents the building ID
      { field: 'status', header: 'Status' },
    ],
    formFields: [
      {
        label: 'Building',
        type: 'select',
        field: 'bid',
        options: [
          { label: 'Model Pharmacy', value: 1 }, // Replace 1 with actual building ID
          { label: 'Rawalpindi Institute Of Cardiology', value: 2 }, // Replace 2 with actual building ID
        ],
      },
      { label: 'Floor Name', type: 'text', field: 'name' },
      { label: 'Description', type: 'textarea', field: 'description' },
      { label: 'Active', type: 'checkbox', field: 'status' },
    ],
    api: {
      get: '/Branch/AllFloors', // Your API endpoint to get all floors
      add: '/Branch/CreateOrUpdateFloor', // Your API endpoint to add a floor
      update: '/Branch/CreateOrUpdateFloor', // Your API endpoint to update a floor
      delete: '/Branch/DeleteFloor', // Your API endpoint to delete a floor
    },
  };
}
