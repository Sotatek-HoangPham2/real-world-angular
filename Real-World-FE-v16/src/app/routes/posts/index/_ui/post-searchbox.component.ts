import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
  selector: "app-searchbox",
  template: `
    <div>
      <div>
        Search
      </div>
      <input
        type="text"
        placeholder="Search..."
        [formControl]="searchControl"
      />
      <button (click)="clearSearch()">X</button>
    </div>
  `,
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class SearchboxComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute)

  searchControl: FormControl;

  clearSearch() {
    this.searchControl.setValue('');
  }

  constructor() {
    const q = this.route.snapshot.queryParamMap.get('q' || '');
    this.searchControl = new FormControl(q);
    this.searchControl.valueChanges.pipe(
      debounceTime(250),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(q => {
      this.router.navigate([], {
        queryParams: { q },
        queryParamsHandling: 'merge'
      })
    });
  }
}