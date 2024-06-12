import { Injectable, OnDestroy, inject } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { BehaviorSubject, combineLatest, map, share } from "rxjs"
import { PostService } from "src/app/routes/posts/_data/post.service"
import { switchMapWithLoading } from "src/app/shared/utils/data-fetching"


@Injectable({ providedIn: 'root' })
export class PostQuery implements OnDestroy {
  private postService = inject(PostService)
  private route = inject(ActivatedRoute)
  private router = inject(Router)

  // client states
  postsRefresh$ = new BehaviorSubject(undefined)
  postsFilters$ = this.route.queryParamMap.pipe(
    map(params => ({
      q: params.get('q') || ''
    })),
  )

  // server states
  posts$ = combineLatest([this.postsFilters$, this.postsRefresh$]).pipe(
    switchMapWithLoading(([params]) => this.postService.getPosts(params)),
    share(),
  )

  // methods
  invalidate() {
    this.postsRefresh$.next(undefined)
  }

  updateSearchFilter(q: string) {
    this.router.navigate([], {
      queryParams: { q },
      queryParamsHandling: 'merge'
    })
  }

  ngOnDestroy(): void {
    console.log('haha')
  }
}