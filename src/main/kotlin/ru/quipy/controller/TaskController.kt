package ru.quipy.controller

import org.springframework.web.bind.annotation.*
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.*
import java.util.*

@RestController
@RequestMapping("/tasks")
class TaskController(
        val taskEsService: EventSourcingService<UUID, TaskAggregate, TaskAggregateState>
) {

    @PostMapping("/{taskTitle}")
    fun changeTaskName(
        @PathVariable taskTitle: String,
        @RequestParam userId: UUID) : TaskNameChangedEvent {
        return taskEsService.create {
            it.changeTaskName(taskTitle, userId)
        }
    }

    @GetMapping("/{taskId}/assignTaskToUser")
    fun getAccount(
        @PathVariable taskId: UUID,
        @RequestParam userId: UUID): TaskAssignedToUserEvent {
        return taskEsService.update(taskId) {
            it.assignTaskToUser(taskId, userId)
        }
    }

    @PostMapping("/{taskId}/setTaskStatus")
    fun createStatus(
        @PathVariable taskId: UUID,
        @RequestParam(required = true, value = "statusName") statusName: String,
        @RequestParam(required = true, value = "userId") userId: UUID) : TaskStatusSetEvent {
        return taskEsService.update(taskId) {
            it.setTaskStatus(statusName, userId)
        }
    }

    @DeleteMapping("/{taskId}/deleteStatus")
    fun deleteStatus(
        @PathVariable taskId: UUID,
        @RequestParam(required = true, value = "deleterId") deleterId: UUID) : TaskStatusClearedEvent {
        return taskEsService.update(taskId) {
            it.clearTaskStatus(deleterId)
        }
    }


}