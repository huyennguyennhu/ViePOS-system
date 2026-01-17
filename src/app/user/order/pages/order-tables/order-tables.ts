import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Table {
  id: string;
  name: string;
  status: 'Available' | 'Occupied';
  floorId: string;
}

interface Floor {
  id: string;
  name: string;
}

@Component({
  selector: 'app-order-tables',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-tables.html',
  styleUrl: './order-tables.css',
})
export class OrderTablesComponent {
  floors: Floor[] = [
    { id: 'F1', name: 'Tầng 1' },
    { id: 'F2', name: 'Tầng 2' },
  ];

  tables: Table[] = [
    // Tầng 1
    { id: '1', name: '101', status: 'Available', floorId: 'F1' },
    { id: '2', name: '102', status: 'Occupied', floorId: 'F1' },
    { id: '3', name: '103', status: 'Available', floorId: 'F1' },
    { id: '4', name: '104', status: 'Available', floorId: 'F1' },
    { id: '5', name: '105', status: 'Occupied', floorId: 'F1' },
    { id: '6', name: '106', status: 'Available', floorId: 'F1' },
    // Tầng 2
    { id: '7', name: '201', status: 'Available', floorId: 'F2' },
    { id: '8', name: '202', status: 'Available', floorId: 'F2' },
    { id: '9', name: '203', status: 'Occupied', floorId: 'F2' },
    { id: '10', name: '204', status: 'Available', floorId: 'F2' },
  ];

  selectedFloorId: string = 'F1';

  get selectedFloorName() {
    return this.floors.find(f => f.id === this.selectedFloorId)?.name || '';
  }

  get filteredTables() {
    return this.tables.filter(t => t.floorId === this.selectedFloorId);
  }

  selectFloor(id: string) {
    this.selectedFloorId = id;
  }
}
