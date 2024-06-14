import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { PostStore } from 'src/app/routes/posts/_data/post.store';
import { PostListItemComponent } from 'src/app/routes/posts/_ui/post-list-item.component';
import { SearchboxComponent } from 'src/app/routes/posts/index/_ui/post-searchbox.component';
import { faker } from '@faker-js/faker';
import { PostFiltersComponent } from 'src/app/routes/posts/index/_ui/post-filters.component';

@Component({
  selector: 'app-route-component',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PostListItemComponent,
    ReactiveFormsModule,
    SearchboxComponent,
    PostFiltersComponent,
  ],
  providers: [PostStore],
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <button
        (click)="createPost()"
        [disabled]="vm.create.status === 'loading'"
      >
        Create Random Post
      </button>
      <hr />
      <div style="display: flex; gap: 8px">
        <app-searchbox />
        <app-post-filters />
      </div>

      <div
        *ngIf="
          vm.list.status === 'loading' && !vm.list.data && !vm.list.error;
          else loadedContent
        "
      >
        Skeleton...
      </div>

      <ng-template #loadedContent>
        <div [ngStyle]="{ opacity: vm.list.status === 'loading' ? 0.6 : 1 }">
          <div *ngIf="vm.list.status === 'error'">Error!</div>

          <ul *ngIf="vm.list.data?.length; else emptyList">
            <app-post-list-item
              *ngFor="let post of vm.list.data"
              [post]="post"
              (delete)="deletePost(post.id)"
              [isLoading]="
                vm.delete.status === 'loading' && vm.delete.data === post.id
              "
            >
              {{ post.title }}
            </app-post-list-item>
          </ul>

          <ng-template #emptyList> No posts found </ng-template>
        </div>
      </ng-template>
    </ng-container>
  `,
})
export default class RouteComponent implements OnInit {
  params$ = this.route.queryParamMap.pipe(
    map((params) => ({
      q: params.get('q') || '',
      page: params.get('page') || '1',
    }))
  );
  vm$ = this.postStore.vm$;

  constructor(
    private readonly postStore: PostStore,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.postStore.getPosts(this.params$);
  }

  createPost() {
    this.postStore.createPost({
      title: faker.lorem.words(),
      content: faker.lorem.paragraph(),
    });
  }

  deletePost(value: number) {
    this.postStore.deletePost(value);
  }
}
