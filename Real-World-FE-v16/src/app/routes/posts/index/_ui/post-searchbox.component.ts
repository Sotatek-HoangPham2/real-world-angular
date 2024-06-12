import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { PostQuery } from "src/app/routes/posts/_data/post.query";

@Component({
  selector: "app-post-searchbox",
  template: `
    <div>
      <input
        type="text"
        [formControl]="searchControl"
      />
      <button (click)="clearSearch()">Xx</button>
    </div>
  `,
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class PostSearchboxComponent implements OnInit {
  postQuery = inject(PostQuery);
  searchControl = new FormControl('');

  ngOnInit(): void {
    // sync searchControl with query params and vice versa
    this.postQuery.postsFilters$.subscribe((filters) => {
      this.searchControl.setValue(filters.q, { emitEvent: false });
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((q) => {
      this.postQuery.updateSearchFilter(q || '');
    });
  }

  clearSearch() {
    this.searchControl.setValue('');
  }

}