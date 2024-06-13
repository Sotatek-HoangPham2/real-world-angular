import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from 'src/app/routes/posts/_data/post.model';

@Component({
  selector: 'app-post-list-item',
  standalone: true,
  template: ` <div [ngStyle]="{display: 'flex', opacity: isLoading ? 0.6 : 1 }">
    <a routerLink="/posts/{{ post.id }}">{{ post.title }}</a>
    <button (click)="delete.emit(post.id)">Delete</button>
  </div>`,
  imports: [RouterLink, CommonModule],
})
export class PostListItemComponent {
  @Input({ required: true }) post!: Post;
  @Input() isLoading: boolean = false;
  @Output() delete = new EventEmitter<number>();
}
