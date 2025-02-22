import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
@Component({
  selector: 'app-dynamic-table',
  imports: [TableModule,CommonModule,IconFieldModule,InputIconModule],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss'
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData:any[]= [
  
  ];
  @Input() tableTitle:string=''

  ngOnInit(): void {
    
  }
getKeys():any[]{
  return this.tableData.length>0?Object.keys(this.tableData[0]):[]
}
}
