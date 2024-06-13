import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Post, CreatePostDTO } from 'src/app/routes/posts/_data/post.model';
import { CommonFilters } from 'src/app/shared/model/common';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);

  getPosts(params: CommonFilters = {}) {
    return this.http.get<Post[]>('posts', {
      params: { ...params },
    });
  }

  getPostById(id: string) {
    return this.http.get<Post>(`posts/${id}`);
  }

  createPost(data: CreatePostDTO) {
    return this.http.post('posts', data);
  }

  updatePost(payload: { id: string; data: CreatePostDTO }) {
    return this.http.put(`posts/${payload.id}`, payload.data);
  }

  deletePost(id: number) {
    return this.http.delete(`posts/${id}`);
  }
}
