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

  createPost(data: CreatePost) {
    return this.http.post('posts', data);
  }

  updatePost(payload: { id: string; data: CreatePost }) {
    return this.http.put(`posts/${payload.id}`, payload.data);
  }

  deletePost(id: string) {
    return this.http.delete(`posts/${id}`);
  }
}

export interface Post {
  content?: string;
  id: number;
  published?: boolean;
  title: string;
}

export interface CreatePost extends Omit<Post, 'id'> {}
