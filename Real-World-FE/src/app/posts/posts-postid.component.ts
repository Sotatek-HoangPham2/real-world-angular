import { Component, Input, inject } from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { PostService } from './data-access/post.service';

@Component({
  selector: 'post',
  standalone: true,
  template: `
    @switch (postQ.status()) {
      @case ('pending') {
        Loading...
      }
      @case ('error') {
        Error!
      }
      @default {
        <h3>{{ postQ.data()?.title }}</h3>
        <p>{{ postQ.data()?.content }}</p>
      }
    }
  `,
})
export default class PostDetailComponent {
  @Input() postId: string = '';
  #postService = inject(PostService);

  postQ = injectQuery(() => ({
    queryKey: ['PostService', 'getPostById', this.postId],
    queryFn: () =>
      lastValueFrom(this.#postService.getPostById(String(this.postId))),
  }));
}
