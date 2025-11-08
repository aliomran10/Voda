import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css'
})
export class DatePickerComponent implements OnChanges {
  @Input() availableDates: string[] = [];
  @Output() dateChange = new EventEmitter<string | undefined>();

  selectedDate: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    // No auto-selection - start with "All Dates" to show all cities with latest day
    // This ensures requirement #1 is met: "List weather in all cities for latest day available"
  }

  onDateChange(): void {
    this.dateChange.emit(this.selectedDate || undefined);
  }

  clearDate(): void {
    this.selectedDate = '';
    this.dateChange.emit(undefined);
  }
}
