import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl, FormGroup, NgModelGroup } from '@angular/forms';

/** Display first validation error message found in the control or its tree of controls
 * if the control has been touched or is not valid.
 * Similar technique for Reactive Forms. */
@Component({
  selector: 'app-validation-error',
  template: `
    <div
      *ngIf="control.invalid && control.touched && control.enabled"
      style="color: red; font-size: 14px;"
    >
      {{ errorMessage }}
    </div>
  `,
  standalone: true,
  imports: [CommonModule],
})
export class ValidationErrorComponent {
  @Input({ required: true }) control!: AbstractControl;

  get errorMessage() {
    return getErrorMessage(this.control);
  }
}

function getErrorMessage(control: AbstractControl) {
  const errors = control.errors;
  if (errors) {
    if (errors['required']) {
      return 'Value is required';
    }
    if (errors['minlength']) {
      return `Minimum length is ${errors['minlength'].requiredLength}`;
    }
  }

  return '';
}
