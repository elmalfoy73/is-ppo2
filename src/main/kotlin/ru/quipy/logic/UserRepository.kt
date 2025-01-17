package ru.quipy.logic

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface UserRepository : JpaRepository<UserEntity, UUID> {
    fun findByLogin(login: String): MutableList<UserEntity>
}