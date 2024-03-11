import { Component, Input } from '@angular/core';
import { Post } from '../data-access/post.service';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  template: `
    <h3>{{ post.title }}</h3>
    <p>{{ post.content }}</p>
  `,
})
export class PostDetailComponent {
  @Input({ required: true }) post!: Post;
}
