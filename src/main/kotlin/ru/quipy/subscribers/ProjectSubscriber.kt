package ru.quipy.subscribers

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.quipy.api.*
import ru.quipy.projections.*
import ru.quipy.repository.ProjectMembersRepository
import ru.quipy.repository.ProjectTasksRepository
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct


@Service
class ProjectSubscriber(
    private val subManager: AggregateSubscriptionsManager,
    val projectTasksRepository: ProjectTasksRepository,
    val projectMembersRepository: ProjectMembersRepository
) {
    val logger: Logger = LoggerFactory.getLogger(TaskSubscriber::class.java)

    @PostConstruct
    fun init() {
        subManager.createSubscriber(ProjectAggregate::class, "project-projection") {
            `when`(UserAddedToProjectEvent::class) { event ->
                val project = projectMembersRepository.findById(event.userId).orElse(null)
                if (project != null) {
                    project.members.addLast(event.userId)
                    projectMembersRepository.save(project)
                }
                logger.info("User added to Project: {}", event.login)
            }
            `when`(ProjectCreatedEvent::class) { event ->
                projectMembersRepository.save(
                    ProjectMembersProjection(
                        event.id,
                        event.projectName,
                        event.userId,
                        listOf(event.userId),
                    )
                )
                projectTasksRepository.save(
                    ProjectTasksProjection(
                        event.id,
                        event.projectName,
                        event.userId,
                        emptyList(),
                    )
                )
                logger.info("Project created: {}", event.projectName)
            }
            `when`(ProjectUpdatedEvent::class) { event ->
                logger.info("Project created: {}", event.projectName)
            }
            `when`(StatusCreatedEvent::class) { event ->
                logger.info("Status created: {}", event.statusName)
            }
            `when`(StatusDeletedEvent::class) { event ->
                logger.info("Status deleted: {}", event.statusName)
            }
            `when`(TaskCreatedEvent::class) { event ->
                val project = projectTasksRepository.findById(event.taskId).orElse(null)
                if (project != null) {
                    project.tasks.addLast(event.taskId)
                    projectTasksRepository.save(project)
                }
                logger.info("Task created: {}", event.taskName)

            }
        }
    }
}