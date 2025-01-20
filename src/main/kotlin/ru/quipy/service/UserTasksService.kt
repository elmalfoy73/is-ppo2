package ru.quipy.service

import org.springframework.stereotype.Service
import ru.quipy.projections.MemberEntity
import ru.quipy.projections.TaskEntity
import ru.quipy.repository.ProjectMembersRepository
import ru.quipy.repository.UserTasksRepository
import java.util.*

@Service
class UserTasksService (
    private val userTasksRepository
    : UserTasksRepository,
) {
    fun findUserTasks(id : UUID) : List<UUID> {
        return userTasksRepository.findById(id).get().tasks
    }
}