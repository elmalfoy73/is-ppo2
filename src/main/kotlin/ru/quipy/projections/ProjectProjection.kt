package ru.quipy.projections

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.quipy.api.ProjectAggregate
import ru.quipy.api.ProjectCreatedEvent
import ru.quipy.api.ProjectUpdatedEvent
import ru.quipy.api.UserAddedToProjectEvent
import ru.quipy.logic.MemberEntity
import ru.quipy.logic.MemberRepository
import ru.quipy.logic.ProjectEntity
import ru.quipy.logic.ProjectRepository
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct


@Service
class ProjectProjection(
    private val projectRepository: ProjectRepository,
    private val memberRepository: MemberRepository,
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
        }
    }

    fun findProject(projectID: UUID): ProjectEntity? {
        return projectRepository.findByIdOrNull(projectID)
    }

    fun getAllProjectMembers(projectID: UUID): List<MemberEntity> {
        return memberRepository.findAllByProjectID(projectID)
    }
}