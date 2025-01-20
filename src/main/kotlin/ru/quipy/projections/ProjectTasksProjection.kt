package ru.quipy.projections

import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "project_tasks")
data class ProjectTasksProjection(
    val projectId: UUID,
    val projectName: String,
    val creatorId: UUID,
    val tasks: List<UUID>
)
data class TaskEntity(
    val id: UUID,
    val name: String,
    val statusAssigned: String?
)

data class StatusEntity(
    val name: String
)