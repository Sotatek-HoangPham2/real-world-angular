export interface Post {
  content?: string;
  id: number;
  published?: boolean;
  title: string;
}

export interface CreatePostDTO extends Omit<Post, 'id'> {}
