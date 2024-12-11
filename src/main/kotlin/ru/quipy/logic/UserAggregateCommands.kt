package ru.quipy.logic

import ru.quipy.api.UserAuthorizedEvent
import ru.quipy.api.UserCreatedEvent
import java.util.*

fun UserAggregateState.createUser(login: String, password: String): UserCreatedEvent {
    if (this.users.containsKey(login)) {
        throw IllegalArgumentException("User with login $login already exists")
    }
    return UserCreatedEvent(
        login = login,
        password = password
    )
}

fun UserAggregateState.authorizeUser(login: String, password: String): UserAuthorizedEvent {
    val user = this.users[login] ?: throw IllegalArgumentException("User with login $login not found")
    if (user.password != password) {
        throw IllegalArgumentException("Incorrect password for login $login")
    }
    return UserAuthorizedEvent(
        login = login
    )
}
