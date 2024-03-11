import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularQueryDevtools],
  template: `
    <h1>Medium</h1>
    <router-outlet></router-outlet>
    <angular-query-devtools initialIsOpen />
  `,
})
export class AppComponent {
  title = 'Real-World-FE';
  api = environment.apiUrl;
}
