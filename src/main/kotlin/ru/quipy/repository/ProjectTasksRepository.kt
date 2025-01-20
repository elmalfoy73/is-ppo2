package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.projections.ProjectMembersProjection
import ru.quipy.projections.ProjectTasksProjection
import java.util.*

interface ProjectTasksRepository : MongoRepository<ProjectTasksProjection, UUID>