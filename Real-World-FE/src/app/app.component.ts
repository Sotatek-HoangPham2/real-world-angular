import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../environments/environment';
import { AngularQueryDevtools } from '@tanstack/angular-query-devtools-experimental';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AngularQueryDevtools, RouterLink],
  template: `
    <div style="margin-bottom: 20px; font-size: 20px;">
      <a routerLink="/">Home</a> | <a routerLink="/posts">Posts</a>
    </div>
    <router-outlet></router-outlet>
    <angular-query-devtools initialIsOpen />
  `,
})
export class AppComponent {
  title = 'Real-World-FE';
  api = environment.apiUrl;
}
