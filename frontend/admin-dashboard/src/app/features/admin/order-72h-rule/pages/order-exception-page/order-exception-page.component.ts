import { Component } from '@angular/core';
import { ExceptionFormComponent } from '../../components/exception-form/exception-form.component';

@Component({
  selector: 'mm-order-exception-page',
  standalone: true,
  imports: [ExceptionFormComponent],
  templateUrl: './order-exception-page.component.html',
  styleUrl: './order-exception-page.component.scss',
})
export class OrderExceptionPageComponent {}
