package ru.quipy.controller

import org.springframework.web.bind.annotation.*
import ru.quipy.api.TaskAggregate
import ru.quipy.api.TaskCreatedEvent
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.TaskAggregateState
import ru.quipy.logic.addTask
import ru.quipy.logic.create
import java.util.*

@RestController
@RequestMapping("/tasks")
class TaskController(
        val taskEsService: EventSourcingService<UUID, TaskAggregate, TaskAggregateState>
) {

    @PostMapping("/{taskTitle}")
    fun createTask(@PathVariable taskTitle: String, @RequestParam creatorId: String) : TaskCreatedEvent {
        return taskEsService.create { it.create(UUID.randomUUID(), taskTitle, creatorId) }
    }

    @GetMapping("/{taskId}")
    fun getAccount(@PathVariable taskId: UUID) : TaskAggregateState? {
        return taskEsService.getState(taskId)
    }

    @PostMapping("/{taskId}/tasks/{taskName}")
    fun createTask(@PathVariable taskId: UUID, @PathVariable taskName: String) : TaskCreatedEvent {
        return taskEsService.update(taskId) {
            it.addTask(taskName)
        }
    }
}