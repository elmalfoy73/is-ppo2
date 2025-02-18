package ru.quipy.projections

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.quipy.api.*
import ru.quipy.logic.MemberEntity
import ru.quipy.logic.TaskEntity
import ru.quipy.repository.MemberRepository
import ru.quipy.repository.StatusRepository
import ru.quipy.repository.TaskRepository
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct


@Service
class TaskProjection(
    private val taskRepository: TaskRepository,
    private val statusRepository: StatusRepository,
    private val subManager: AggregateSubscriptionsManager,
) {
    @PostConstruct
    fun init() {
        subManager.createSubscriber(TaskAggregate::class, "task-projection") {
            `when`(TaskNameChangedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    taskRepository.save(
                        TaskEntity(
                            event.taskId,
                            taskRepository.findByIdOrNull(event.taskId)!!.name,
                            taskRepository.findByIdOrNull(event.taskId)!!.statusAssigned,
                        )
                    )
                }
            }
            `when`(TaskStatusClearedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    taskRepository.save(
                        TaskEntity(
                            event.taskId,
                            event.name,
                            null,
                        )
                    )
                }
            }
            `when`(TaskStatusSetEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    taskRepository.save(
                        TaskEntity(
                            event.taskId,
                            taskRepository.findByIdOrNull(event.taskId)!!.name,
                            event.statusName,
                        )
                    )
                }
            }
        }
    }

    fun findTask(taskID: UUID): TaskEntity? {
        return taskRepository.findByIdOrNull(taskID)
    }

}