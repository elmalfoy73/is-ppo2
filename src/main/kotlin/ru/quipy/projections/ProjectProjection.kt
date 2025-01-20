package ru.quipy.projections

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.quipy.api.*
import ru.quipy.logic.MemberEntity
import ru.quipy.repository.MemberRepository
import ru.quipy.logic.ProjectEntity
import ru.quipy.logic.StatusEntity
import ru.quipy.logic.TaskEntity
import ru.quipy.repository.ProjectRepository
import ru.quipy.repository.StatusRepository
import ru.quipy.repository.TaskRepository
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct


@Service
class ProjectProjection(
    private val projectRepository: ProjectRepository,
    private val memberRepository: MemberRepository,
    private val taskRepository: TaskRepository,
    private val statusRepository: StatusRepository,
    private val subManager: AggregateSubscriptionsManager,
) {
    @PostConstruct
    fun init() {
        subManager.createSubscriber(ProjectAggregate::class, "project-projection") {
            `when`(UserAddedToProjectEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    memberRepository.save(
                        MemberEntity(
                            event.userId,
                            event.login,
                        )
                    )
                }
            }
            `when`(ProjectCreatedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    projectRepository.save(
                        ProjectEntity(
                            event.id,
                            event.projectName
                        )
                    )
                }
            }
            `when`(ProjectUpdatedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    projectRepository.save(
                        ProjectEntity(
                            event.projectID,
                            event.projectName
                        )
                    )
                }
            }
            `when`(StatusCreatedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    statusRepository.save(
                        StatusEntity(
                            event.statusName
                        )
                    )
                }
            }
            `when`(StatusDeletedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    statusRepository.delete(
                        StatusEntity(
                            event.statusName
                        )
                    )
                }
            }
            `when`(TaskCreatedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    taskRepository.save(
                        TaskEntity(
                            event.taskId,
                            event.taskName,
                            null,
                        )
                    )
                }
            }
        }
    }

    fun findProject(projectID: UUID): ProjectEntity? {
        return projectRepository.findByIdOrNull(projectID)
    }

    fun getAllProjectMembers(projectID: UUID): List<MemberEntity> {
        return memberRepository.findAllByProjectID(projectID)
    }
}