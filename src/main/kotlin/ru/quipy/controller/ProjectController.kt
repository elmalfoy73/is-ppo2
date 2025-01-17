package ru.quipy.controller

import org.springframework.web.bind.annotation.*
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.*
import java.util.*

@RestController
@RequestMapping("/projects")
class ProjectController(
    val projectEsService: EventSourcingService<UUID, ProjectAggregate, ProjectAggregateState>
) {

    @GetMapping("/{id}")
    fun getProject(@PathVariable id: UUID): ProjectAggregateState? {
        return projectEsService.getState(id)
    }

    @PostMapping("/update")
    fun updateProject(
        @RequestParam id: UUID,
        @RequestParam name: String,
    ): ProjectUpdatedEvent {
        val response = projectEsService.update(id) {
            it.updateProject(id, name)
        }

        return response
    }

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
        @RequestParam(required = true, value = "userId") userId: UUID,
        @RequestParam(required = true, value = "login") login: String) : UserAddedToProjectEvent {
        return projectEsService.update(projectId) {
            it.addUserToProject(userId = userId, login = login, projectId = projectId)
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