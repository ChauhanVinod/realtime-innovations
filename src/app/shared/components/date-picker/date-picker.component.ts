import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent {
  @Input() selectedDate?: Date;
  @Input() currentMonth!: Date;
  @Output() dateSelected = new EventEmitter<Date>();
  @Output() closed = new EventEmitter<void>();

  dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: { date: Date; isCurrentMonth: boolean }[] = [];

  ngOnInit() {
    if (!this.currentMonth) this.currentMonth = new Date();
    this.generateCalendar();
  }

  generateCalendar() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const endDay = lastDay.getDate();

    this.calendarDays = [];

    // Previous month days
    for (let i = 0; i < startDay; i++) {
      const date = new Date(year, month, -startDay + i + 1);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let day = 1; day <= endDay; day++) {
      const date = new Date(year, month, day);
      this.calendarDays.push({ date, isCurrentMonth: true });
    }

    // Next month days
    const remaining = 42 - this.calendarDays.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }
  }

  selectDate(day: { date: Date; isCurrentMonth: boolean }) {
    if (day.isCurrentMonth) {
      this.selectedDate = day.date;
    }
  }

  isSelected(day: { date: Date }): boolean {
    return this.selectedDate?.toDateString() === day.date.toDateString();
  }

  previousMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1
    );
    this.generateCalendar();
  }

  selectToday() {
    this.selectedDate = new Date();
    this.currentMonth = new Date();
    this.generateCalendar();
  }

  selectNextMonday() {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + ((1 - today.getDay() + 7) % 7 || 7));
    this.selectedDate = nextMonday;
    this.currentMonth = nextMonday;
    this.generateCalendar();
  }
  
  selectNextTuesday() {
    const today = new Date();
    const nextTuesday = new Date(today);
    nextTuesday.setDate(today.getDate() + ((2 - today.getDay() + 7) % 7 || 7));
    this.selectedDate = nextTuesday;
    this.currentMonth = nextTuesday;
    this.generateCalendar();
  }
  
  selectAfterOneWeek() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    this.selectedDate = date;
    this.currentMonth = new Date(date);
    this.generateCalendar();
  }

  saveSelection() {
    if (this.selectedDate) {
      this.dateSelected.emit(this.selectedDate);
    }
    this.closed.emit();
  }

  cancelSelection() {
    this.closed.emit();
  }
}