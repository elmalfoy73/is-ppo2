package ru.quipy.projections

import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "user_tasks")
data class UserTasksProjection(
    val userId : UUID,
    val login : String,
    val tasks: List<UUID>
)