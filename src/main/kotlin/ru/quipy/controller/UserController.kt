package ru.quipy.controller

import org.springframework.web.bind.annotation.*
import ru.quipy.api.UserAggregate
import ru.quipy.api.UserCreatedEvent
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.UserAggregateState
import ru.quipy.logic.addUser
import ru.quipy.logic.create
import java.util.*

@RestController
@RequestMapping("/users")
class UserController(
        val userEsService: EventSourcingService<UUID, UserAggregate, UserAggregateState>
) {

    @PostMapping("/{userTitle}")
    fun createUser(@PathVariable userTitle: String, @RequestParam creatorId: String) : UserCreatedEvent {
        return userEsService.create { it.create(UUID.randomUUID(), userTitle, creatorId) }
    }

    @GetMapping("/{userId}")
    fun getAccount(@PathVariable userId: UUID) : UserAggregateState? {
        return userEsService.getState(userId)
    }

    @PostMapping("/{userId}/users/{userName}")
    fun createUser(@PathVariable userId: UUID, @PathVariable userName: String) : UserCreatedEvent {
        return userEsService.update(userId) {
            it.addUser(userName)
        }
    }
}