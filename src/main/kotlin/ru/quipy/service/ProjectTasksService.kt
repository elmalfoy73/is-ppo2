package ru.quipy.service

import org.springframework.stereotype.Service
import ru.quipy.projections.MemberEntity
import ru.quipy.projections.TaskEntity
import ru.quipy.repository.ProjectMembersRepository
import ru.quipy.repository.ProjectTasksRepository
import java.util.*

@Service
class ProjectTasksService (
    private val projectTasksRepository
    : ProjectTasksRepository,
) {
    fun findProjectTasks(id : UUID) : Set<TaskEntity> {
        return projectTasksRepository.findById(id).get().tasks
    }
}