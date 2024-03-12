import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../data-access/post.service';
import { RouterLink } from '@angular/router';

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
