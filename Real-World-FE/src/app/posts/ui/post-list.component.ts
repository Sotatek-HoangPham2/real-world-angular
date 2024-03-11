import { Component, Input } from '@angular/core';
import { Post } from '../data-access/post.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-list',
  standalone: true,
  template: ` <ul>
    @for (post of posts; track post.id) {
      <li>
        <a routerLink="/posts/{{ post.id }}">{{ post.title }}</a>
      </li>
    } @empty {
      No Post
    }
  </ul>`,
  imports: [RouterLink],
})
export class PostList {
  @Input() posts: Post[] = [];
}
