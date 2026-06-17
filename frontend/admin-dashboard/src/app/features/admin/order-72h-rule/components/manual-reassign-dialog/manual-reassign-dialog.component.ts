import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mm-manual-reassign-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './manual-reassign-dialog.component.html',
  styleUrl: './manual-reassign-dialog.component.scss',
})
export class ManualReassignDialogComponent {}
