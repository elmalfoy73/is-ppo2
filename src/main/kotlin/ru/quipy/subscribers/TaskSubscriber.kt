package ru.quipy.subscribers

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.TaskAggregateState
import ru.quipy.logic.UserAggregateState
import ru.quipy.projections.MemberEntity
import ru.quipy.projections.TaskEntity
import ru.quipy.projections.UserTasksProjection
import ru.quipy.repository.TaskRepository
import ru.quipy.repository.UserTasksRepository
import ru.quipy.service.UserTasksService
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct


@Service
class TaskSubscriber (
    val subscriptionsManager: AggregateSubscriptionsManager,
    val userEsService: EventSourcingService<UUID, UserAggregate, UserAggregateState>,
    val userTasksRepository: UserTasksRepository,
    val taskRepository: TaskRepository
    ) {

    val logger: Logger = LoggerFactory.getLogger(TaskSubscriber::class.java)

    @PostConstruct
    fun init() {
        subscriptionsManager.createSubscriber(TaskAggregate::class, "task-projection") {
            `when`(TaskNameChangedEvent::class) { event ->
                logger.info("Task changed: {}", event.newName)
            }

            `when`(TaskStatusClearedEvent::class) { event ->
                logger.info("Task status cleared: {}", event.name)
            }

            `when`(TaskStatusSetEvent::class) { event ->
                logger.info("Task status set: {}", event.statusName)
            }

            `when`(TaskAssignedToUserEvent::class) { event ->
                val user = userTasksRepository.findById(event.assigneeId).orElse(null)
                if (user != null) {
                    user.tasks.addLast(event.taskId)
                    userTasksRepository.save(user)
                }
                logger.info("Task assigned to user: {}", userEsService.getState(event.assigneeId)?.user?.login)
            }

        }
    }

}