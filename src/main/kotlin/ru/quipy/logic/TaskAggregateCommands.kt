package ru.quipy.logic

import ru.quipy.api.*
import java.util.*

fun TaskAggregateState.changeTaskName(newName: String, userId: UUID): TaskNameChangedEvent {
    if (taskName == newName) {
        throw IllegalArgumentException("Task name is already $newName")
    }
    return TaskNameChangedEvent(this.getId(), newName, userId)
}

fun TaskAggregateState.assignTaskToUser(assigneeId: UUID, assignerId: UUID): TaskAssignedToUserEvent {
    if (this.assigneeId == assigneeId) {
        throw IllegalArgumentException("Task is already assigned to user with ID $assigneeId")
    }
    return TaskAssignedToUserEvent(this.getId(), assigneeId, assignerId)
}

fun TaskAggregateState.clearTaskStatus(userId: UUID): TaskStatusClearedEvent {
    if (statusName == null) {
        throw IllegalArgumentException("Task status is already cleared")
    }
    return TaskStatusClearedEvent(this.getId(), userId)
}

fun TaskAggregateState.setTaskStatus(statusName: String, userId: UUID): TaskStatusSetEvent {
    if (this.statusName == statusName) {
        throw IllegalArgumentException("Task status is already set to $statusName")
    }
    return TaskStatusSetEvent(this.getId(), statusName, userId)
}
