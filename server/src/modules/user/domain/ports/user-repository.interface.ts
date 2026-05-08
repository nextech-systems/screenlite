import { User } from '@/core/entities/user.entity.ts'
import { PaginationResponse } from '@/core/types/pagination.types.ts'
import { UsersQueryOptionsDTO } from '../dto/users-query-options.dto.ts'

export interface IUserRepository {
    findById(id: string): Promise<User | null>
    findByEmail(email: string): Promise<User | null>
    findAll(queryOptions?: UsersQueryOptionsDTO): Promise<PaginationResponse<User>>
    save(user: User): Promise<void>
    countByEmail(email: string): Promise<number>
    count(): Promise<number>
}