import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CreatePostDTO, Post } from 'src/app/routes/posts/_data/post.model';
import { PostStore } from 'src/app/routes/posts/_data/post.store';
import { ValidationErrorComponent } from 'src/app/shared/ui/validation-error.component';

@Component({
  selector: 'app-route-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <h1>post new</h1>
      <form
        *ngIf="vm$ | async as vm"
        [ngStyle]="{ opacity: vm.create.status === 'loading' ? 0.5 : 1 }"
        (ngSubmit)="onSubmit()"
        #postForm="ngForm"
      >
        <div>
          <input
            [(ngModel)]="model.title"
            name="title"
            placeholder="Title"
            required
            #name="ngModel"
          />
          <app-validation-error [control]="$any(name)" />
        </div>
        <div>
          <input
            [(ngModel)]="model.content"
            name="content"
            placeholder="Content"
            required
            minlength="10"
            #content="ngModel"
          />
          <app-validation-error [control]="$any(content)" />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 10px;
        width: 400px;
      }

      input.ng-touched.ng-invalid {
        border: 2px solid red;
      }

      .ng-sumitted .ng-invalid {
        border: 2px solid red;
      }
    `,
  ],
  imports: [FormsModule, CommonModule, ValidationErrorComponent],
  providers: [PostStore],
})
export default class RouteComponent {
  @ViewChild('postForm') form!: NgForm;
  vm$ = this.postStore.vm$;

  model: CreatePostDTO = {
    content: '',
    title: '',
    published: false,
  };

  constructor(
    private readonly postStore: PostStore,
    private readonly router: Router
  ) {
    this.postStore.vm$.pipe(takeUntilDestroyed()).subscribe((vm) => {
      if (vm.create.status === 'success') {
        this.router.navigate(['/posts']);
      }
      if (vm.create.status === 'error') {
        alert('Error creating post');
      }
    });
  }

  onSubmit() {
    this.form.control.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    this.postStore.createPost(this.model);
  }
}
