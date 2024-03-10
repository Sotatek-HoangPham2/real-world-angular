```
npm install
npm run dev
```

```
open http://localhost:8080
```

- `GET` /posts
  - Query:
    - q
    - page
    - limit
  - Description: Get list of Posts
- `GET` /posts/:id
  - Param:
    - id
  - Description: Get post by id
- `POST` /posts
  - Body:
    - title
    - content
    - published
  - Description: Create Post
- `PUT` /posts/:id
  - Param:
    - id
  - Body:
    - title
    - content
    - published
  - Description: Update Post
- `DELETE` /posts/:id
  - Param:
    - id
  - Description: Delete Post
