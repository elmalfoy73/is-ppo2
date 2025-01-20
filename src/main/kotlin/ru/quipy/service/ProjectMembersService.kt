package ru.quipy.service

import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import ru.quipy.projections.MemberEntity
import ru.quipy.projections.ProjectMembersProjection
import ru.quipy.repository.ProjectMembersRepository
import java.util.*

@Service
class ProjectMembersService (
    private val projectMembersRepository
    : ProjectMembersRepository,
) {
    fun findProjectMembers(id : UUID) : Set<MemberEntity> {
        return projectMembersRepository.findById(id).get().members
    }
}