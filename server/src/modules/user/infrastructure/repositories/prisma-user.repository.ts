import { User } from '@/core/entities/user.entity.ts'
import { Prisma, User as PrismaUser } from '@/generated/prisma/client.ts'
import { IUserRepository } from '@/modules/user/domain/ports/user-repository.interface.ts'
import { PrismaClient } from '@/generated/prisma/client.ts'
import { PrismaRepositoryUserMapper } from '@/modules/user/infrastructure/mappers/prisma-repository-user.mapper.ts'
import { Paginator } from '@/shared/utils/pagination.util.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { UsersQueryOptionsDTO } from '../../domain/dto/users-query-options.dto.ts'

export class PrismaUserRepository implements IUserRepository {
    constructor(
        private readonly prisma: PrismaClient | Prisma.TransactionClient,
    ) {}

    async findById(id: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({ where: { id } })

        return user ? this.toDomain(user) : null
    }

    async findByEmail(email: string): Promise<User | null> {
        const where: Prisma.UserWhereInput = {
            email: {
                equals: email,
                mode: 'insensitive',
            },
        }

        const user = await this.prisma.user.findFirst({ where })

        return user ? this.toDomain(user) : null
    }

    async save(user: User): Promise<void> {
        const userData = this.toPersistence(user)

        const where: Prisma.UserUpsertArgs['where'] = {
            id: userData.id,
            version: userData.version,
        }

        await this.prisma.user.upsert({
            where,
            create: userData,
            update: {
                ...userData,
                version: {
                    increment: 1,
                },
            },
        })
    }

    private toDomain(prismaUser: PrismaUser): User {
        return PrismaRepositoryUserMapper.toDomain(prismaUser)
    }

    private toPersistence(user: User): Omit<PrismaUser, 'createdAt' | 'updatedAt'> {
        return PrismaRepositoryUserMapper.toPersistence(user)
    }

    async findAll(queryOptions?: UsersQueryOptionsDTO): Promise<PaginationResponse<User>> {
        const { filters, pagination } = queryOptions || {}

        const where: Prisma.UserWhereInput = {}

        if (filters?.email) {
            where.email = {
                equals: filters.email,
                mode: 'insensitive',
            }
        }

        if (filters?.roles) {
            where.role = {
                in: filters.roles,
            }
        }

        const findManyFn = (skip: number, take: number) => this.prisma.user.findMany({ where, skip, take })
        
        const countFn = () => this.prisma.user.count({ where })

        const result = await Paginator.paginate(
            findManyFn,
            countFn,
            pagination
        )

        return {
            items: result.items.map(this.toDomain),
            meta: result.meta,
        }
    }

    async countByEmail(email: string): Promise<number> {
        const where: Prisma.UserWhereInput = {
            email: {
                equals: email,
                mode: 'insensitive',
            }
        }

        return this.prisma.user.count({
            where            
        })
    }

    async count(): Promise<number> {
        return this.prisma.user.count()
    }
}
