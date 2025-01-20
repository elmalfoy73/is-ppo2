package ru.quipy.projections

import org.springframework.data.mongodb.core.mapping.Document
import java.util.*

@Document(collection = "project_members")
data class ProjectMembersProjection(
    val projectId: UUID,
    val projectName: String,
    val creatorId: UUID,
    val members: List<UUID>
)

data class MemberEntity(
    val id: UUID,
    val login: String
)