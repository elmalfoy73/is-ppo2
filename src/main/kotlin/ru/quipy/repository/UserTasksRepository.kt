package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.logic.UserEntity
import ru.quipy.projections.UserTasksProjection
import java.util.*

interface UserTasksRepository : MongoRepository<UserTasksProjection, UUID> {
}