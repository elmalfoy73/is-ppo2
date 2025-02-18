package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.logic.UserEntity
import java.util.*

interface UserRepository : MongoRepository<UserEntity, UUID> {
    fun findByLogin(login: String): MutableList<UserEntity>
}