import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { combineLatest, concatMap, switchMap, tap } from 'rxjs';
import { CreatePostDTO, Post } from 'src/app/routes/posts/_data/post.model';
import { PostService } from 'src/app/routes/posts/_data/post.service';
import { CommonFilters, LoadingState } from 'src/app/shared/model/common';

export interface PostState {
  list: LoadingState<Array<Post>>;
  detail: LoadingState<Post>;
  create: LoadingState<Post>;
  delete: LoadingState<number>;
  // TODO: update state
  updatedAt: number;
}

const initialState: PostState = {
  list: { status: 'initial' },
  detail: { status: 'initial' },
  create: { status: 'initial' },
  delete: { status: 'initial' },
  updatedAt: Date.now(),
};

@Injectable()
export class PostStore extends ComponentStore<PostState> {
  constructor(private readonly postService: PostService) {
    super(initialState);
  }

  // selectors
  private readonly updatedAt$ = this.select((state) => state.updatedAt);
  private readonly list$ = this.select((state) => state.list);
  private readonly detail$ = this.select((state) => state.detail);
  private readonly create$ = this.select((state) => state.create);
  private readonly delete$ = this.select((state) => state.delete);

  // view models
  readonly vm$ = this.select({
    list: this.list$,
    detail: this.detail$,
    create: this.create$,
    delete: this.delete$,
  });

  // effects
  readonly getPosts = this.effect<CommonFilters>((filter$) => {
    return combineLatest([filter$, this.updatedAt$]).pipe(
      tap(() =>
        this.patchState((state) => ({
          list: { ...state.list, status: 'loading' },
        }))
      ),
      switchMap(([filter]) =>
        this.postService.getPosts(filter).pipe(
          tapResponse({
            next: (data) =>
              this.patchState({
                list: { status: 'success', data },
              }),
            error: (error) =>
              this.patchState({
                list: { status: 'error', error },
              }),
          })
        )
      )
    );
  });

  readonly getPostById = this.effect<string>((id$) => {
    return combineLatest([id$, this.updatedAt$]).pipe(
      tap(() =>
        this.patchState(() => ({
          detail: { status: 'loading' },
        }))
      ),
      switchMap(([id]) =>
        this.postService.getPostById(id).pipe(
          tapResponse({
            next: (data) =>
              this.patchState({
                detail: { status: 'success', data },
              }),
            error: (error) =>
              this.patchState({
                detail: { status: 'error', error },
              }),
          })
        )
      )
    );
  });

  readonly createPost = this.effect<CreatePostDTO>((post$) => {
    return post$.pipe(
      tap(() =>
        this.patchState(() => ({
          create: { status: 'loading' },
        }))
      ),
      concatMap((data) =>
        this.postService.createPost(data).pipe(
          tapResponse({
            next: () =>
              this.patchState({
                create: { status: 'success' },
                updatedAt: Date.now(),
              }),
            error: () =>
              this.patchState({
                create: { status: 'error' },
              }),
          })
        )
      )
    );
  });

  readonly deletePost = this.effect<number>((id$) => {
    return id$.pipe(
      tap((id) => this.patchState({ delete: { status: 'loading', data: id } })),
      concatMap((id) =>
        this.postService.deletePost(id).pipe(
          tapResponse({
            next: () =>
              this.patchState({
                delete: { status: 'success' },
                updatedAt: Date.now(),
              }),
            error: () =>
              this.patchState({
                delete: { status: 'error' },
              }),
          })
        )
      )
    );
  });

  // methods
  invalidate() {
    this.patchState({ updatedAt: Date.now() });
  }
}
