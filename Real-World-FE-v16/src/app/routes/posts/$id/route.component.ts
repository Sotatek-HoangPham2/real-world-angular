import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PostStore } from 'src/app/routes/posts/_data/post.store';

@Component({
  selector: 'app-route-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="vm$ | async as vm" >
      <div *ngIf="vm.detail.status === 'loading'">Loading...</div>
      <div *ngIf="vm.detail.status === 'error'">Error!</div>
      <div *ngIf="vm.detail.status === 'success'">
        <h1>{{vm.detail.data?.title}}</h1>
        <p>{{vm.detail.data?.content}}</p>
      </div>
    </div>
  `,
  providers: [PostStore],
  imports: [CommonModule]
})
export default class RouteComponent {
  @Input() set id(value: string) {
    this.postStore.getPostById(value)
  }

  vm$ = this.postStore.vm$

  constructor(private readonly postStore: PostStore) { }
}
