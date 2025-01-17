package ru.quipy.logic

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ProjectRepository : JpaRepository<ProjectEntity, UUID>