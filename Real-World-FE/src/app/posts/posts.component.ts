import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { PostService } from './data-access/post.service';
import { PostList } from './ui/post-list.component';
import { FormsModule } from '@angular/forms';
import { fromEvent, lastValueFrom, takeUntil } from 'rxjs';

@Component({
  selector: 'posts',
  standalone: true,
  imports: [RouterLink, PostList, FormsModule],
  template: `
    <input type="text" placeholder="Search..." [(ngModel)]="q" />
    <div>
      @switch (postsQ.status()) {
        @case ('pending') {
          Loading...
        }
        @case ('error') {
          Fail To Load
        }
        @case ('success') {
          <app-post-list [posts]="postsQ.data() || []" />
        }
      }
    </div>
  `,
})
export default class PostComponent {
  postService = inject(PostService);
  q = signal('');

  postsQ = injectQuery(() => ({
    queryKey: ['postService.getPosts', this.q()],
    queryFn: (context) => {
      const abort$ = fromEvent(context.signal, 'abort');
      return lastValueFrom(
        this.postService.getPosts({ q: this.q() }).pipe(takeUntil(abort$)),
      );
    },
  }));
}
