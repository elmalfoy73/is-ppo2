package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import java.util.*

class ProjectAggregateState : AggregateState<UUID, ProjectAggregate> {
    private lateinit var projectId: UUID
    var createdAt: Long = System.currentTimeMillis()
    var updatedAt: Long = System.currentTimeMillis()

    lateinit var projectName: String
    var tasks = mutableMapOf<UUID, TaskEntity>()
    var statuses = mutableMapOf<UUID, TaskStatus>()
    var users = mutableSetOf<UUID>()

    override fun getId() = projectId
}

data class TaskEntity(
    val id: UUID = UUID.randomUUID(),
    val name: String,
    val statusAssigned: UUID
)

data class TaskStatus(
    val id: UUID = UUID.randomUUID(),
    val name: String
)
