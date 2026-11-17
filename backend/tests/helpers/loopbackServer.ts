import http from 'node:http';
import type { Express } from 'express';
import { beforeAll, afterAll } from 'vitest';

// supertest's default `request(app)` starts the app with `app.listen(0)`, which listens on every interface, but then
// connects to http://127.0.0.1:<port>. If another local program listens on 127.0.0.1 on that same port, it answers
// instead of the app and the test fails at random. Binding the test server to 127.0.0.1 explicitly avoids that.
export function useLoopbackServer(app: Express): () => http.Server {
  let server: http.Server;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  return () => server;
}
