package ru.quipy.controller

import org.springframework.web.bind.annotation.*
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.*
import ru.quipy.projections.MemberEntity
import ru.quipy.projections.StatusEntity
import ru.quipy.projections.TaskEntity
import ru.quipy.service.ProjectMembersService
import ru.quipy.service.ProjectTasksService
import java.util.*

@RestController
@RequestMapping("/projects")
class ProjectController(
    val projectEsService: EventSourcingService<UUID, ProjectAggregate, ProjectAggregateState>,
    val projectMembersService: ProjectMembersService,
    val projectTasksService: ProjectTasksService,
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

    @GetMapping("/{projectId}/tasks/{taskId}")
    fun getTask(@PathVariable projectId: UUID, @PathVariable taskId: UUID): TaskEntity? {
        return projectEsService.getState(projectId)?.tasks?.get(taskId)
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

    @GetMapping("/{projectId}/statuses")
    fun getStatuses(@PathVariable projectId: UUID) : Set<StatusEntity> {
        return projectEsService.getState(projectId)?.statuses!!.values.toSet()
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

    @GetMapping("/{projectId}/members")
    fun getMembers(@PathVariable projectId: UUID) : Set<MemberEntity> {
        return projectMembersService.findProjectMembers(projectId)
    }

    @GetMapping("/{projectId}/tasks")
    fun getTasks(@PathVariable projectId: UUID) : Set<TaskEntity> {
        return projectTasksService.findProjectTasks(projectId)
    }
}