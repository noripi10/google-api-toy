import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();
app.get('/', (c) => {
  const q = c.req.query('code');
  return c.text(q ?? 'null');
});
serve({
  fetch: app.fetch,
  port: 3000,
});
