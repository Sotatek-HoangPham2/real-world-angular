import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);

  getPosts(params: { q?: string } = {}) {
    return this.http.get<Post[]>('posts', { params });
  }

  getPostById(id: string) {
    return this.http.get<Post>(`posts/${id}`);
  }
}

export interface Post {
  content: string;
  id: number;
  published: boolean;
  title: string;
}
