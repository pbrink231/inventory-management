import Fastify from 'fastify';
import firstRoute from './our-first-route';

const server = Fastify({
  logger: true,
});

interface IQuerystring {
  username: string;
  password: string;
}

interface IHeaders {
  'h-Custom': string;
}

interface IReply {
  200: { hello: string };
  302: { url: string };
  '4xx': { error: string };
}

server.get<{
  Querystring: IQuerystring;
  Headers: IHeaders;
  Reply: IReply;
}>('/', async (request, reply) => {
  reply.code(200).send({ hello: 'world' });
});

server.register(firstRoute);

/**
 * Run the server!
 */
const start = async () => {
  try {
    console.log('starting server...')
    await server.listen({ port: 3000 });
    console.log('Server listening at http://localhost:3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
