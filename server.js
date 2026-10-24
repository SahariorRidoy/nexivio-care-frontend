import { createServer } from 'http';
import next from 'next';

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, dir: process.cwd(), port });
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    const server = createServer((req, res) => handle(req, res));
    server.on('error', (err) => {
      console.error('HTTP server error:', err);
      process.exit(1);
    });
    server.listen(port, '0.0.0.0', () => {
      console.log(`Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Next.js failed to start:', err);
    process.exit(1);
  });