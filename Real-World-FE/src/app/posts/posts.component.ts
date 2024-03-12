import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  injectMutation,
  injectQuery,
  injectQueryClient,
} from '@tanstack/angular-query-experimental';
import { PostService } from './data-access/post.service';
import { FormsModule } from '@angular/forms';
import { fromEvent, lastValueFrom, takeUntil } from 'rxjs';
import { PostListItemComponent } from './ui/post-list-item.component';

@Component({
  selector: 'posts',
  standalone: true,
  imports: [RouterLink, FormsModule, PostListItemComponent],
  template: `
    <div style="margin-bottom: 20px">
      <a routerLink="/posts/new">New Post</a>
    </div>
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
          <ul>
            @for (post of postsQ.data(); track post.id) {
              <app-post-list-item
                [post]="post"
                (delete)="handleDelete($event)"
              />
            } @empty {
              No Post
            }
          </ul>
        }
      }
    </div>
  `,
})
export default class PostComponent {
  q = signal('');

  #queryClient = injectQueryClient();
  #postService = inject(PostService);

  postsQ = injectQuery(() => ({
    queryKey: ['PostService', 'getPosts', this.q()],
    queryFn: (context) => {
      const abort$ = fromEvent(context.signal, 'abort');
      return lastValueFrom(
        this.#postService.getPosts({ q: this.q() }).pipe(takeUntil(abort$)),
      );
    },
  }));

  deletePostMutation = injectMutation(() => ({
    mutationFn: (id: number) =>
      lastValueFrom(this.#postService.deletePost(String(id))),
  }));

  handleDelete(id: number) {
    this.deletePostMutation.mutate(id, {
      onSuccess: () => {
        return this.#queryClient.invalidateQueries({
          queryKey: ['PostService'],
        });
      },
    });
  }
}
