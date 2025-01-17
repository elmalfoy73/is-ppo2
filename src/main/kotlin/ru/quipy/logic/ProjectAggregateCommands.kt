package ru.quipy.logic

import ru.quipy.api.*
import java.util.*

fun ProjectAggregateState.createProject(name: String, userId: UUID): ProjectCreatedEvent {
    return ProjectCreatedEvent(name, userId)
}

fun ProjectAggregateState.addUserToProject(userId: UUID, login: String, projectId: UUID,): UserAddedToProjectEvent {
    if (users.contains(userId)) {
        throw IllegalArgumentException("User with ID $userId is already part of the project")
    }
    return UserAddedToProjectEvent(userId = userId,
                                   login = login,
                                    projectId = projectId)
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

fun ProjectAggregateState.updateProject(id: UUID, name: String): ProjectUpdatedEvent {
    return ProjectUpdatedEvent(
        projectID = id,
        projectName = name,
    )
}

//fun ProjectAggregateState.setTaskStatus(statusName: String, userId: UUID): TaskStatusSetEvent {
//    if (this.tasks)//(this.statusName == statusName) {
//        throw IllegalArgumentException("Task status is already set to $statusName")
//    }
//    return TaskStatusSetEvent(this.getId(), statusName, userId)
//}
