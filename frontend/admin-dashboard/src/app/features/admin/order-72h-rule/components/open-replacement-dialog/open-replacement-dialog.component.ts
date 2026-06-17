import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mm-open-replacement-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './open-replacement-dialog.component.html',
  styleUrl: './open-replacement-dialog.component.scss',
})
export class OpenReplacementDialogComponent {}
