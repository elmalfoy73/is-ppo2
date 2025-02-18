package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.logic.TaskEntity
import java.util.*

interface TaskRepository : MongoRepository<TaskEntity, UUID>