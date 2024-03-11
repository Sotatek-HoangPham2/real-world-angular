import {
  Component,
  Input,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PostService } from './data-access/post.service';
import { PostDetailComponent } from './ui/post-detail.component';
import { lastValueFrom } from 'rxjs';

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
        <app-post-detail [post]="postQ.data()!" />
      }
    }
  `,
  imports: [PostDetailComponent],
})
export default class PostDetailPage {
  @Input() postId: string = '';
  postService = inject(PostService);

  postQ = injectQuery(() => ({
    queryKey: ['postService.getPostById', this.postId],
    queryFn: () =>
      lastValueFrom(this.postService.getPostById(String(this.postId))),
  }));
}
