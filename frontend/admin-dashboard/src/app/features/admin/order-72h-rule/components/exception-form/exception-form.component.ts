import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'mm-exception-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './exception-form.component.html',
  styleUrl: './exception-form.component.scss',
})
export class ExceptionFormComponent {}
