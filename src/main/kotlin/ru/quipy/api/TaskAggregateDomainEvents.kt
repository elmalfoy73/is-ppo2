package ru.quipy.api

import ru.quipy.core.annotations.DomainEvent
import ru.quipy.domain.Event
import java.util.*

const val TASK_NAME_CHANGED_EVENT = "TASK_NAME_CHANGED_EVENT"
const val TASK_ASSIGNED_TO_USER_EVENT = "TASK_ASSIGNED_TO_USER_EVENT"
const val TASK_STATUS_CLEARED_EVENT = "TASK_STATUS_CLEARED_EVENT"
const val TASK_STATUS_SET_EVENT = "TASK_STATUS_SET_EVENT"

@DomainEvent(name = TASK_NAME_CHANGED_EVENT)
class TaskNameChangedEvent(
    val taskId: UUID,
    val newName: String,
    val changerId: UUID,
    createdAt: Long = System.currentTimeMillis()
) : Event<TaskAggregate>(
    name = TASK_NAME_CHANGED_EVENT,
    createdAt = createdAt
)

@DomainEvent(name = TASK_ASSIGNED_TO_USER_EVENT)
class TaskAssignedToUserEvent(
    val taskId: UUID,
    val assigneeId: UUID,
    val assignerId: UUID,
    createdAt: Long = System.currentTimeMillis()
) : Event<TaskAggregate>(
    name = TASK_ASSIGNED_TO_USER_EVENT,
    createdAt = createdAt
)

@DomainEvent(name = TASK_STATUS_CLEARED_EVENT)
class TaskStatusClearedEvent(
    val taskId: UUID,
    val userId: UUID,
    createdAt: Long = System.currentTimeMillis()
) : Event<TaskAggregate>(
    name = TASK_STATUS_CLEARED_EVENT,
    createdAt = createdAt
)

@DomainEvent(name = TASK_STATUS_SET_EVENT)
class TaskStatusSetEvent(
    val taskId: UUID,
    val statusId: UUID,
    val userId: UUID,
    createdAt: Long = System.currentTimeMillis()
) : Event<TaskAggregate>(
    name = TASK_STATUS_SET_EVENT,
    createdAt = createdAt
)
