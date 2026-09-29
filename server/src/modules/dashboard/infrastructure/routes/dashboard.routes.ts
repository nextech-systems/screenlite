import { FastifyInstance } from 'fastify'
import { v4 as uuidv4 } from 'uuid'

const dashboardRoutes = async (fastify: FastifyInstance) => {
    const prisma = fastify.prisma

    // GET all dashboards for workspace
    fastify.get('/', async (request: any, reply) => {
        const { workspaceId } = request.params
        const dashboards = await prisma.dashboard.findMany({
            where: { workspaceId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
        })
        return reply.send({ dashboards })
    })

    // GET single dashboard HTML (public - for iframe rendering)
    fastify.get('/:dashboardId/render', async (request: any, reply) => {
        const { dashboardId } = request.params
        const dashboard = await prisma.dashboard.findUnique({
            where: { id: dashboardId }
        })
        if (!dashboard) return reply.status(404).send('Not found')
        return reply.type('text/html').send(dashboard.content)
    })

    // GET single dashboard
    fastify.get('/:dashboardId', async (request: any, reply) => {
        const { dashboardId } = request.params
        const dashboard = await prisma.dashboard.findUnique({
            where: { id: dashboardId }
        })
        if (!dashboard) return reply.status(404).send({ error: 'Not found' })
        return reply.send({ dashboard })
    })

    // POST create dashboard
    fastify.post('/', async (request: any, reply) => {
        const { workspaceId } = request.params
        const { name, description, content } = request.body as any
        const dashboard = await prisma.dashboard.create({
            data: {
                id: uuidv4(),
                workspaceId,
                name,
                description: description ?? null,
                content,
                updatedAt: new Date(),
            }
        })
        return reply.send({ dashboard })
    })

    // PUT update dashboard
    fastify.put('/:dashboardId', async (request: any, reply) => {
        const { dashboardId } = request.params
        const { name, description, content } = request.body as any
        const dashboard = await prisma.dashboard.update({
            where: { id: dashboardId },
            data: { name, description: description ?? null, content, updatedAt: new Date() }
        })
        return reply.send({ dashboard })
    })

    // DELETE dashboard
    fastify.delete('/:dashboardId', async (request: any, reply) => {
        const { dashboardId } = request.params
        await prisma.dashboard.update({
            where: { id: dashboardId },
            data: { deletedAt: new Date() }
        })
        return reply.send({ success: true })
    })
}

export default dashboardRoutes
