package ru.quipy.logic

import ru.quipy.api.UserAuthorizedEvent
import ru.quipy.api.UserCreatedEvent
import ru.quipy.api.UserUpdatedEvent
import java.util.*

fun UserAggregateState.createUser(login: String, password: String): UserCreatedEvent {
    if (this.users.filterValues { it.login == login }.isNotEmpty()) {
        throw IllegalArgumentException("User with login $login already exists")
    }
    return UserCreatedEvent(
        userID = UUID.randomUUID(),
        login = login,
        password = password,
    )
}

fun UserAggregateState.authorizeUser(login: String, password: String): UserAuthorizedEvent {
    val query = this.users.filterValues { it.login == login }
    if (query.isEmpty()) {
        throw IllegalArgumentException("User with login $login not found")
    }
    val user = query.values.first()
    if (user.password != password) {
        throw IllegalArgumentException("Incorrect password for login $login")
    }
    val userId = this.users.filterValues { it.login == login }.keys.first()
    return UserAuthorizedEvent(
        userID = userId,
        login = login,
        password = user.password,
    )
}

fun UserAggregateState.updateUser(id: UUID, login: String, password: String): UserUpdatedEvent {
    return UserUpdatedEvent(
        userID = id,
        login = login,
        password = password
    )
}
