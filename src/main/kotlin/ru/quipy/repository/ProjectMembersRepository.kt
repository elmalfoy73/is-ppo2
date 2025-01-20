package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.projections.ProjectMembersProjection
import java.util.*

interface ProjectMembersRepository : MongoRepository<ProjectMembersProjection, UUID>