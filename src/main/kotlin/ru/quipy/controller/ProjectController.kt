package ru.quipy.controller

import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.*
import java.util.*

@RestController
@RequestMapping("/projects")
class ProjectController(
    val projectEsService: EventSourcingService<UUID, ProjectAggregate, ProjectAggregateState>
) {

    @PostMapping("/create")
    fun createProject(
        @RequestParam(required = true, value = "projectName") projectName: String,
        @RequestParam(required = true, value = "userId") userId: UUID) : ProjectCreatedEvent {
        return projectEsService.create {
            it.createProject(projectName, userId)
        }
    }

    @PostMapping("/{projectId}/addUser")
    fun addUserToProject(
        @PathVariable projectId: UUID,
        @RequestParam(required = true, value = "userId") userId: UUID) : UserAddedToProjectEvent {
        return projectEsService.update(projectId) {
            it.addUserToProject(userId)
        }
    }

    @PostMapping("/{projectId}/tasks/{taskName}")
    fun createTask(@PathVariable projectId: UUID, @PathVariable taskName: String) : TaskCreatedEvent {
        return projectEsService.update(projectId) {
            it.addTask(taskName)
        }
    }

    @PostMapping("/{projectId}/createStatus")
    fun createStatus(
        @PathVariable projectId: UUID,
        @RequestParam(required = true, value = "statusName") statusName: String,
        @RequestParam(required = true, value = "creatorId") creatorId: UUID) : StatusCreatedEvent {
        return projectEsService.update(projectId) {
            it.createStatus(statusName, creatorId)
        }
    }



    @DeleteMapping("/{projectId}/deleteStatus/{statusName}")
    fun deleteStatus(
        @PathVariable projectId: UUID,
        @PathVariable statusName: String,
        @RequestParam(required = true, value = "deleterId") deleterId: UUID) : StatusDeletedEvent {
        return projectEsService.update(projectId) {
            it.deleteStatus(statusName, deleterId)
        }
    }
}