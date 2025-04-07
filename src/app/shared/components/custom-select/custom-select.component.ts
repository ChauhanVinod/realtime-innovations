import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss']
})
export class CustomSelectComponent {
  @Input() roles: string[] = [];
  @Output() selected = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  selectRole(role: string) {
    this.selected.emit(role);
    this.closed.emit();
  }

  close() {
    this.closed.emit();
  }
}