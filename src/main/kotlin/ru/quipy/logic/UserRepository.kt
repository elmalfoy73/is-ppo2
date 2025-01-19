package ru.quipy.logic

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.mongodb.repository.MongoRepository
import java.util.*

interface UserRepository : MongoRepository<UserEntity, UUID> {
    fun findByLogin(login: String): MutableList<UserEntity>
}