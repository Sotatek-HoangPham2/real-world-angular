import { serve } from '@hono/node-server'
import { PrismaClient } from '@prisma/client'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const POSSIBILITY_OF_ERROR = 20 // Percentage
const MIN_DELAY = 300

/**Simulate real environment */
const simulate = async () => {
  const time = MIN_DELAY + 1000 * Math.random()

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })

  if (Math.random() < POSSIBILITY_OF_ERROR / 100) {
    throw new Error('Something wrong')
  }
}

const prisma = new PrismaClient()

const app = new Hono()

const postRoute = new Hono()

// Get Posts
postRoute.get(async (c) => {
  await simulate()
  const q = c.req.query('q')
  const page = Number(c.req.query('page')) || 1
  const limit = Number(c.req.query('limit')) || 10

  const posts = await prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: {
      title: {
        contains: q,
      },
    },
  })

  return c.json(posts)
})

// Create Post
postRoute.post(
  zValidator(
    'json',
    z.object({
      title: z.string().min(6).max(250),
      content: z.string().max(500),
      published: z.coerce.boolean(),
    })
  ),
  async (c) => {
    await simulate()

    const data = c.req.valid('json')
    const post = await prisma.post.create({
      data,
    })

    return c.json(post)
  }
)

// Get Post By ID
postRoute.get('/:id', async (c) => {
  await simulate()

  const id = Number(c.req.param('id'))
  const post = await prisma.post.findFirst({ where: { id } })

  return c.json(post)
})

// Update Post
postRoute.put(
  '/:id',
  zValidator(
    'json',
    z.object({
      title: z.string().min(6).max(250),
      content: z.string().max(500),
      published: z.coerce.boolean(),
    })
  ),
  async (c) => {
    await simulate()

    const id = Number(c.req.param('id'))
    const data = c.req.valid('json')
    const post = await prisma.post.update({ where: { id }, data })

    return c.json(post)
  }
)

// Delete Post
postRoute.delete('/:id', async (c) => {
  await simulate()

  const id = Number(c.req.param('id'))
  await prisma.post.delete({ where: { id } })

  return c.json({ id })
})

app.get('/', (c) => {
  return c.json({
    ok: true,
  })
})

app.route('/posts', postRoute)

const port = 8080
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
