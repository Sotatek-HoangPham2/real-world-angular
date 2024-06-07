import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'posts',
    loadComponent: () => import('./routes/posts/index/route.component'),
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./routes/posts/new/route.component'),
  },
  {
    path: 'posts/:postId',
    loadComponent: () => import('./routes/posts/$id/route.component'),
  },
];
