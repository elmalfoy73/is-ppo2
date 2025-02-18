package ru.quipy.logic

import ru.quipy.api.*
import ru.quipy.core.annotations.StateTransitionFunc
import ru.quipy.domain.AggregateState
import java.util.*

class UserAggregateState : AggregateState<UUID, UserAggregate> {
    private lateinit var user: UserEntity
    var createdAt: Long = System.currentTimeMillis()
    var updatedAt: Long = System.currentTimeMillis()

//    lateinit var userName: String
//    lateinit var userLogin: String
//    lateinit var userPassword: String

    var users = mutableMapOf<UUID, UserEntity>()

    override fun getId() = user.id

    // State transition functions which is represented by the class member function
    @StateTransitionFunc
    fun userCreatedApply(event: UserCreatedEvent) {
        user = UserEntity(
            id = event.userID,
            login = event.login,
            password = event.password
        )
//        userId = event.id
//        userName = event.name
//        userLogin = event.login
//        userPassword = event.password
        updatedAt = createdAt
        createdAt = createdAt
    }

    @StateTransitionFunc
    fun userAuthorisedApply(event: UserAuthorizedEvent) {
//        userId = event.id
//        userLogin = event.login
        user = UserEntity(id = event.userID,
                          login = event.login,
                          password = event.password)
        updatedAt = createdAt
    }

    @StateTransitionFunc
    fun userUpdatedApply(event: UserUpdatedEvent) {
        user = UserEntity(
            id = event.userID,
            login = event.login,
            password = event.password
        )

        updatedAt = event.createdAt
    }
}

data class UserEntity(
    val id: UUID = UUID.randomUUID(),
    val login: String = "",
    val password: String = ""
)
