package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import java.util.*

class UserAggregateState : AggregateState<UUID, UserAggregate> {
    private lateinit var userId: UUID
    var createdAt: Long = System.currentTimeMillis()

    var users = mutableMapOf<String, UserEntity>()

    override fun getId() = userId
}

data class UserEntity(
    val id: UUID,
    val login: String,
    val password: String
)
