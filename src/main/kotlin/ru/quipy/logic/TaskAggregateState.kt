package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import java.util.*

class TaskAggregateState : AggregateState<UUID, TaskAggregate> {
    private lateinit var taskId: UUID
    var createdAt: Long = System.currentTimeMillis()
    var updatedAt: Long = System.currentTimeMillis()

    lateinit var taskName: String
    lateinit var projectId: UUID
    var statusName: String? = null
    var assigneeId: UUID? = null

    override fun getId() = taskId

    @StateTransitionFunc
    fun statusSetApply(event: TaskStatusSetEvent) {
        statusName = event.statusName
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun taskNameChangedApply(event: TaskNameChangedEvent) {
        taskName = event.newName
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun taskAssignedToUserApply(event: TaskAssignedToUserEvent) {
        assigneeId = event.assigneeId
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun taskStatusClearedApply(event: TaskStatusClearedEvent) {
        statusName = null
        updatedAt = event.createdAt
    }
}
