package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.logic.StatusEntity
import ru.quipy.logic.TaskEntity
import ru.quipy.logic.UserEntity
import java.util.*

interface StatusRepository : MongoRepository<StatusEntity, UUID>{
    fun findByName(name: String): MutableList<StatusEntity>
}