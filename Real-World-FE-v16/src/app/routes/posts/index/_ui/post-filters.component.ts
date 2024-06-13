import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-post-filters',
  template: `
    <div>
      <div>Page</div>
      <input
        placeholder="Page"
        type="number"
        [value]="page"
        (change)="setPage($any($event.target).value)"
      />
    </div>
  `,
})
export class PostFiltersComponent {
  page = this.route.snapshot.queryParamMap.get('page') || '1';

  setPage(page: number) {
    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}
}
