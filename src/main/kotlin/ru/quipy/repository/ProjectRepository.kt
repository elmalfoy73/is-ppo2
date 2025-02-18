package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.logic.ProjectEntity
import java.util.*

interface ProjectRepository : MongoRepository<ProjectEntity, UUID>