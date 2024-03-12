import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreatePost, PostService } from './data-access/post.service';
import {
  injectMutation,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  standalone: true,
  template: `
    <form [formGroup]="postForm" (ngSubmit)="onSubmit()" #form="ngForm">
      <div style="margin-bottom: 12px">
        <input type="text" placeholder="Title" formControlName="title" />
        @if (
          !postForm.controls.title.valid &&
          (postForm.controls.title.dirty || form.submitted)
        ) {
          <p style="margin:0; font-size: 14px">Title is required</p>
        }
      </div>
      <div style="margin-bottom: 12px">
        <input type="text" placeholder="Content" formControlName="content" />
      </div>
      <button>Create</button>
      @if (addPostMutation.isPending()) {
        <span>Loading...</span>
      } @else if (addPostMutation.error()) {
        <span>Something went wrong!</span>
      }
    </form>
  `,
  imports: [ReactiveFormsModule],
})
export default class NewPostComponent {
  #queryClient = injectQueryClient();
  #router = inject(Router);
  #postService = inject(PostService);
  #fb = inject(FormBuilder);

  addPostMutation = injectMutation(() => ({
    mutationFn: (data: CreatePost) =>
      lastValueFrom(this.#postService.createPost(data)),
  }));

  postForm = this.#fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(6)]],
    content: [''],
  });

  onSubmit() {
    if (this.postForm.valid) {
      this.addPostMutation.mutate(this.postForm.getRawValue(), {
        onSuccess: async () => {
          this.#queryClient.removeQueries({ queryKey: ['PostService'] });
          this.#router.navigate(['/posts']);
        },
      });
    }
  }
}
