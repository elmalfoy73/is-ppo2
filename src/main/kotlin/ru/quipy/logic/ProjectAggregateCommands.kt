package ru.quipy.logic

import ru.quipy.api.*
import java.util.*

fun ProjectAggregateState.createProject(name: String, userId: UUID): ProjectCreatedEvent {
    return ProjectCreatedEvent(name, userId)
}

fun ProjectAggregateState.addUserToProject(userId: UUID): UserAddedToProjectEvent {
    if (users.contains(userId)) {
        throw IllegalArgumentException("User with ID $userId is already part of the project")
    }
    return UserAddedToProjectEvent(this.getId(), userId)
}

fun ProjectAggregateState.addTask(taskName: String): TaskCreatedEvent {
    val taskId = UUID.randomUUID() //пока так
    return TaskCreatedEvent(this.getId(), taskId, taskName)
}

fun ProjectAggregateState.createStatus(statusName: String, creatorId: UUID): StatusCreatedEvent {
    val containsStatus = statuses.values.any { it.name == statusName }
    if (containsStatus) {
        throw IllegalArgumentException("Status $statusName already exists")
    }

    return StatusCreatedEvent(this.getId(), statusName, creatorId)
}

fun ProjectAggregateState.deleteStatus(statusName: String, deleterId: UUID): StatusDeletedEvent {
    val containsStatus = statuses.values.any { it.name == statusName }
    if (!containsStatus) {
        throw IllegalArgumentException("Status $statusName does not exist")
    }

    for (task in tasks) {
        if (statuses[task.value.statusAssigned]?.name == statusName) {
            throw IllegalArgumentException("Status $statusName is set to task")
        }
    }
    return StatusDeletedEvent(this.getId(), statusName, deleterId)
}
