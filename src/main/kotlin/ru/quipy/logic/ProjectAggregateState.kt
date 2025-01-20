package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import ru.quipy.projections.MemberEntity
import ru.quipy.projections.StatusEntity
import ru.quipy.projections.TaskEntity
import java.util.*

class ProjectAggregateState : AggregateState<UUID, ProjectAggregate> {
    private lateinit var projectId: UUID
    lateinit var creatorId: UUID
    var createdAt: Long = System.currentTimeMillis()
    var updatedAt: Long = System.currentTimeMillis()

    lateinit var projectName: String
    var tasks = mutableMapOf<UUID, TaskEntity>()
    var statuses = mutableMapOf<UUID, StatusEntity>()
    var members = mutableMapOf<UUID, MemberEntity>()

    override fun getId() = projectId
    fun getName() = projectName
    fun getMembers() = members.values.toList()
    fun getMemberByID(id: UUID) = members[id]


    @StateTransitionFunc
    fun projectCreatedApply(event: ProjectCreatedEvent) {
        projectId = event.id
        projectName = event.projectName
        creatorId = event.userId
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun userAddedApply(event: UserAddedToProjectEvent) {
        members[event.userId] = MemberEntity(id = event.userId, login = event.login)
        projectId = event.projectId
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun taskCreatedApply(event: TaskCreatedEvent) {
        tasks[event.taskId] = TaskEntity(id = event.taskId,
                                        name = event.name,
                                        statusAssigned = null)
        projectId = event.projectId
        updatedAt = event.createdAt
    }

    @StateTransitionFunc
    fun statusDeletedApply(event: StatusDeletedEvent) {
        val item = tasks.filterValues { it.name == event.statusName }.keys
        tasks.remove(item.first())
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun statusCreatedApply(event: StatusCreatedEvent) {
        statuses[event.id] = StatusEntity( name = event.statusName)
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun projectUpdatedApply(event: ProjectUpdatedEvent) {
        projectName = event.projectName
        updatedAt = createdAt
    }
}



