import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
})
export class DatePickerComponent {
  @Input() availableDates: string[] = [];
  @Output() dateChange = new EventEmitter<string | undefined>();

  selectedDate: string = '';

  onDateChange(): void {
    this.dateChange.emit(this.selectedDate || undefined);
  }

  clearDate(): void {
    this.selectedDate = '';
    this.dateChange.emit(undefined);
  }
}
