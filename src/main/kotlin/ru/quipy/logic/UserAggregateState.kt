package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import java.util.*

class UserAggregateState : AggregateState<UUID, UserAggregate> {
    private lateinit var userId: UUID
    var createdAt: Long = System.currentTimeMillis()
    var updatedAt: Long = System.currentTimeMillis()

    lateinit var userName: String
    lateinit var userLogin: String
    lateinit var userPassword: String

    var users = mutableMapOf<String, UserEntity>()

    override fun getId() = userId

    // State transition functions which is represented by the class member function
    @StateTransitionFunc
    fun userCreatedApply(event: UserCreatedEvent) {
        userId = event.id
        userName = event.name
        userLogin = event.login
        userPassword = event.password
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun userAuthorisedApply(event: UserAuthorizedEvent) {
        userId = event.id
        userName = event.name
        userLogin = event.login
        updatedAt = createdAt
    }
}

data class UserEntity(
    val id: UUID,
    val login: String,
    val password: String
)
