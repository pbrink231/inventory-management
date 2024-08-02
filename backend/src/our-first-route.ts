import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

async function routes(fastify: FastifyInstance) {
  fastify.get('/something', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.code(200).send({ hello: 'world' });
  });
}

export default routes;
