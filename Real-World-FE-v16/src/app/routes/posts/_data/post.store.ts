import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { combineLatest, concatMap, switchMap, tap } from 'rxjs';
import { CreatePostDTO, Post } from 'src/app/routes/posts/_data/post.model';
import { PostService } from 'src/app/routes/posts/_data/post.service';
import { CommonFilters, LoadingState } from 'src/app/shared/model/common';

export interface PostListState extends LoadingState<Array<Post>> {}

export interface PostDetailState extends LoadingState<Post> {}

export interface PostState {
  list: PostListState;
  detail: PostDetailState;
  invalidateToken: number;
  mutating?: number;
}

const initialState: PostState = {
  list: { status: 'initial' },
  detail: { status: 'initial' },
  invalidateToken: Date.now(),
};

@Injectable()
export class PostStore extends ComponentStore<PostState> {
  constructor(private readonly postService: PostService) {
    super(initialState);
  }

  // selectors
  private readonly invalidateToken$ = this.select(
    (state) => state.invalidateToken
  );
  private readonly list$ = this.select((state) => state.list);
  private readonly detail$ = this.select((state) => state.detail);
  private readonly mutating$ = this.select((state) => state.mutating);

  // view models
  readonly vm$ = this.select({
    list: this.list$,
    detail: this.detail$,
    mutating: this.mutating$,
  });

  // effects
  readonly getPosts = this.effect<CommonFilters>((filter$) => {
    return combineLatest([filter$, this.invalidateToken$]).pipe(
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
                list: { status: 'success', error: undefined, data },
              }),
            error: (error) =>
              this.patchState({
                list: { status: 'error', error, data: undefined },
              }),
          })
        )
      )
    );
  });

  readonly getPostById = this.effect<string>((id$) => {
    return combineLatest([id$, this.invalidateToken$]).pipe(
      tap(() =>
        this.patchState((state) => ({
          detail: { ...state.detail, status: 'loading' },
        }))
      ),
      switchMap(([id]) =>
        this.postService.getPostById(id).pipe(
          tapResponse({
            next: (data) =>
              this.patchState({
                detail: { status: 'success', error: undefined, data },
              }),
            error: (error) =>
              this.patchState({
                detail: { status: 'error', error, data: undefined },
              }),
          })
        )
      )
    );
  });

  readonly createPost = this.effect<CreatePostDTO>((post$) => {
    return post$.pipe(
      tap(() => this.patchState({ mutating: 1 })),
      concatMap((post) =>
        this.postService.createPost(post).pipe(
          tapResponse({
            next: () => this.invalidate(),
            error: () => console.error('Error deleting post'),
            finalize: () => this.patchState({ mutating: undefined }),
          })
        )
      )
    );
  });

  readonly deletePost = this.effect<number>((id$) => {
    return id$.pipe(
      tap((id) => this.patchState({ mutating: id })),
      concatMap((id) =>
        this.postService.deletePost(id).pipe(
          tapResponse({
            next: () => this.invalidate(),
            error: () => console.error('Error deleting post'),
            finalize: () => this.patchState({ mutating: undefined }),
          })
        )
      )
    );
  });

  // methods
  invalidate() {
    this.patchState({ invalidateToken: Date.now() });
  }
}
