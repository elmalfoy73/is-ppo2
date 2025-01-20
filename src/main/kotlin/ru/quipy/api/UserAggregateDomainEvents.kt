package ru.quipy.api

import ru.quipy.core.annotations.DomainEvent
import ru.quipy.domain.Event
import java.util.*

const val USER_CREATED_EVENT = "USER_CREATED_EVENT"
const val USER_AUTHORIZED_EVENT = "USER_AUTHORIZED_EVENT"
const val USER_UPDATED_EVENT = "USER_UPDATED_EVENT"


@DomainEvent(name = USER_CREATED_EVENT)
class UserCreatedEvent(
    val userID: UUID,
    val login: String,
    val password: String,
    createdAt: Long = System.currentTimeMillis()
) : Event<UserAggregate>(
    name = USER_CREATED_EVENT,
    createdAt = createdAt
)

@DomainEvent(name = USER_AUTHORIZED_EVENT)
class UserAuthorizedEvent(
    val userID: UUID,
    val login: String,
    val password: String,
    createdAt: Long = System.currentTimeMillis()
) : Event<UserAggregate>(
    name = USER_AUTHORIZED_EVENT,
    createdAt = createdAt
)

@DomainEvent(name = USER_UPDATED_EVENT)
class UserUpdatedEvent(
    val userID: UUID,
    val login: String,
    val password: String,
    createdAt: Long = System.currentTimeMillis(),
) : Event<UserAggregate>(
    name = USER_UPDATED_EVENT,
    createdAt = createdAt,
)