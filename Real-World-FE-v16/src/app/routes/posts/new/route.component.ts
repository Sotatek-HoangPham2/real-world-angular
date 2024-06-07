import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-route-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h1>post new</h1>
    </div>
  `,
})
export default class RouteComponent {}
