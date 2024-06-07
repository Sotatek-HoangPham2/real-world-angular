import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from 'src/app/routes/posts/_data/post.model';

@Component({
  selector: 'app-post-list-item',
  standalone: true,
  template: ` <div style="display: flex">
    <a routerLink="/posts/{{ post.id }}">{{ post.title }}</a>
    <button (click)="delete.emit(post.id)">Delete</button>
  </div>`,
  imports: [RouterLink],
})
export class PostListItemComponent {
  @Input({ required: true }) post!: Post;
  @Output() delete = new EventEmitter<number>();
}
