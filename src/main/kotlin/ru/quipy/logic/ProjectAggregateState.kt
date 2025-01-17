package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import java.util.*

class ProjectAggregateState : AggregateState<UUID, ProjectAggregate> {
    private lateinit var projectId: UUID
    lateinit var creatorId: UUID
    var createdAt: Long = System.currentTimeMillis()
    var updatedAt: Long = System.currentTimeMillis()

    lateinit var projectName: String
    var tasks = mutableMapOf<UUID, TaskEntity>()
    var statuses = mutableMapOf<UUID, StatusEntity>()
    var users = mutableSetOf<UUID>()

    override fun getId() = projectId

    @StateTransitionFunc
    fun projectCreatedApply(event: ProjectCreatedEvent) {
        projectId = event.id
        projectName = event.projectName
        creatorId = event.userId
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun userAddedApply(event: UserAddedToProjectEvent) {
        users.add(event.userId)
        projectId = event.projectId
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun taskCreatedApply(event: TaskCreatedEvent) {
        tasks[event.taskId] = TaskEntity(id = event.taskId,
                                        name = event.name,
                                        statusAssigned = null)
        projectId = event.projectId
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun statusDeletedApply(event: StatusDeletedEvent) {
        val item = tasks.filterValues { it.name == event.statusName }.keys
        tasks.remove(item.first())
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun statusCreatedApply(event: StatusCreatedEvent) {

        statuses[event.id] = StatusEntity(id = event.id, name = event.statusName)
        updatedAt = createdAt
    }
}

data class TaskEntity(
    val id: UUID = UUID.randomUUID(),
    val name: String,
    val statusAssigned: UUID?
)

data class StatusEntity(
    val id: UUID = UUID.randomUUID(),
    val name: String
)
