import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'posts',
    loadComponent: () => import('./posts/posts.component'),
  },
  {
    path: 'posts/new',
    loadComponent: () => import('./posts/posts-new.component'),
  },
  {
    path: 'posts/:postId',
    loadComponent: () => import('./posts/posts-postid.component'),
  },
];
