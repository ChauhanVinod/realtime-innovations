// shared.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { CustomSelectComponent } from './components/custom-select/custom-select.component';

@NgModule({
  declarations: [
    CustomSelectComponent,
    DatePickerComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CustomSelectComponent,
    DatePickerComponent,
  ]
})
export class SharedModule { }