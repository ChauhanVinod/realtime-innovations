import { Injectable, signal, effect } from '@angular/core';
import { openDB, type DBSchema } from 'idb';
import { Employee } from '../models/employee.model';

interface EmployeeDB extends DBSchema {
  employees: {
    key: number;
    value: Employee;
  };
}

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private dbPromise = openDB<EmployeeDB>('employee-db', 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('employees')) {
        db.createObjectStore('employees', { keyPath: 'id' });
      }
    },
  });

  employees = signal<Employee[]>([]);

  constructor() {
    this.initializeDB();
  }

  private async initializeDB() {
    try {
      await this.loadEmployees();
    } catch (error) {
      console.error('IndexedDB initialization failed:', error);
    }
  }

  async loadEmployees() {
    const db = await this.dbPromise;
    const data = await db.getAll('employees');
    this.employees.set(data);
  }

  async addEmployee(employee: Omit<Employee, 'id'> | Employee) {
    const db = await this.dbPromise;
  
    const newEmployee: Employee = {
      id: 'id' in employee ? employee.id : Date.now(),
      name: employee.name,
      role: employee.role,
      hireDate: employee.hireDate,
      endDate: employee.endDate,
    };
  
    await db.put('employees', newEmployee);
    await this.loadEmployees();
  }

  async getEmployeeById(id: number): Promise<Employee | undefined> {
    const db = await this.dbPromise;
    return await db.get('employees', id);
  }

  async updateEmployee(id: number, updatedData: Partial<Employee>) {
    const db = await this.dbPromise;
    const existing = await db.get('employees', id);
    if (existing) {
      const updated = { ...existing, ...updatedData };
      await db.put('employees', updated);
      await this.loadEmployees();
    }
  }

  async deleteEmployee(id: number) {
    const db = await this.dbPromise;
    await db.delete('employees', id);
    await this.loadEmployees();
  }
}