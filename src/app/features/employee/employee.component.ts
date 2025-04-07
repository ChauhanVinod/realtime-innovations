import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../core/services/employee.service';
import { ROLES } from 'src/app/core/models/employee.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
})
export class EmployeeComponent implements OnInit {
  private employeeService = inject(EmployeeService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  employees = this.employeeService.employees;
  showAddForm = signal(false);
  title = signal('Employee List');
  employeeForm: FormGroup;
  swipedEmployeeId: number | null = null;
  roles = ROLES;
  showRoleSelector = false;
  formattedHireDate = 'Today';
  formattedEndDate = 'No Date';

  // Date picker related properties
  showDatePicker = false;
  activeDateField: 'hireDate' | 'endDate' = 'hireDate';
  currentMonth = new Date();
  selectedDate?: Date;

  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      role: ['', Validators.required],
      hireDate: [null],
      endDate: [null]
    });
  }

  ngOnInit(): void {
    this.employeeService.loadEmployees();
  }

  selectRole(role: string) {
    this.employeeForm.get('role')?.setValue(role);
    this.showRoleSelector = false;
  }

  async deleteEmployee(id: number) {
    const employee = await this.employeeService.getEmployeeById(id);
    if (employee) {
      await this.employeeService.deleteEmployee(id);
      if (this.swipedEmployeeId === id) this.swipedEmployeeId = null;
      
      const snackRef = this.snackBar.open('Employee data has been deleted', 'Undo', { duration: 5000 });
      snackRef.onAction().subscribe(async () => {
        await this.employeeService.addEmployee(employee);
      });
    }
  }

  async editEmployee(id: number) {
    const employee = await this.employeeService.getEmployeeById(id);
    if (employee) {
      this.employeeForm.patchValue({
        name: employee.name,
        role: employee.role,
        hireDate: employee.hireDate,
        endDate: employee.endDate
      });
      this.formattedHireDate = this.formatDate(employee.hireDate);
      this.formattedEndDate = this.formatDate(employee.endDate);
      this.showAddForm.set(true);
      this.title.set('Edit Employee Details');
    }
  }

  // View management
  toggleView() {
    this.showAddForm.update(val => !val);
    this.title.set(this.showAddForm() ? 'Add Employee Details' : 'Employee List');
    if (!this.showAddForm()) {
      this.swipedEmployeeId = null;
      this.employeeForm.reset();
    } else {
      this.formattedHireDate = 'Today';
      this.formattedEndDate = 'No Date';
    }
  }

  // Form submission
  onSave() {
    if (this.employeeForm.valid) {
      const formValue = this.employeeForm.value;
      if (this.swipedEmployeeId !== null) {
        this.employeeService.updateEmployee(this.swipedEmployeeId, formValue);
      } else {
        this.employeeService.addEmployee(formValue);
      }
      this.employeeForm.reset();
      this.swipedEmployeeId = null;
      this.toggleView();
    }
  }

  // Date handling
  formatDate(value: string | Date | null): string {
    if (!value) return 'No date';
    const date = typeof value === 'string' ? new Date(value) : value;
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Date picker integration
  openDatePicker(field: 'hireDate' | 'endDate') {
    this.activeDateField = field;
    const currentValue = this.employeeForm.get(field)?.value;
    
    if (currentValue) {
      this.selectedDate = new Date(currentValue);
      this.currentMonth = new Date(currentValue);
    } else {
      this.selectedDate = new Date();
      this.currentMonth = new Date();
    }
    
    this.showDatePicker = true;
  }

  onDateSelected(selectedDate: Date) {
    const dateString = selectedDate.toDateString();
    this.employeeForm.get(this.activeDateField)?.setValue(dateString);
    
    const formatted = this.formatDate(dateString);
    if (this.activeDateField === 'hireDate') {
      this.formattedHireDate = formatted;
    } else {
      this.formattedEndDate = formatted;
    }
  }

  // Swipe handling
  onSwipe(id: number) {
    this.swipedEmployeeId = id;
  }

  onSwipeCancel(id: number) {
    if (this.swipedEmployeeId === id) this.swipedEmployeeId = null;
  }
}