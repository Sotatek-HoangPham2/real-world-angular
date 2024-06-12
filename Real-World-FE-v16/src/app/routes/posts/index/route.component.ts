import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PostQuery } from 'src/app/routes/posts/_data/post.query';
import { PostListItemComponent } from 'src/app/routes/posts/_ui/post-list-item.component';
import { PostSearchboxComponent } from 'src/app/routes/posts/index/_ui/post-searchbox.component';


@Component({
  selector: 'app-route-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, PostListItemComponent, ReactiveFormsModule, PostSearchboxComponent],
  template: `
    <!-- <app-post-searchbox/> -->

    <div *ngIf="postQuery.posts$ | async as posts">
      <ng-container *ngIf="posts.isLoading">
        Loading...
      </ng-container>
      <div *ngIf="posts.error">Error!</div>
      <div>
        <ul>
          <app-post-list-item *ngFor="let post of posts.data" [post]="post">
            {{ post.title }}
          </app-post-list-item>
        </ul>
      </div>
      <small *ngIf="posts.isFetching">Fetching...</small>
      <button (click)="postQuery.invalidate()">Reload</button>
    </div>
  `,
})


export default class RouteComponent {
  postQuery = inject(PostQuery);
}
