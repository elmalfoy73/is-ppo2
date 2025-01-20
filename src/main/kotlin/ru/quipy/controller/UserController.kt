package ru.quipy.controller

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.*
import java.util.*

@RestController
@RequestMapping("/users")
class UserController(
        val userEsService: EventSourcingService<UUID, UserAggregate, UserAggregateState>
) {

    @PostMapping("/create")
    fun createUser(
        @RequestParam(required = true, value = "login") login: String,
        @RequestParam(required = true, value = "password") password: String) : UserCreatedEvent {
        return userEsService.create {
            it.createUser(login, password)
        }
    }
    @PostMapping("/authorize/{userId}")
    fun authorizeUser(
        @PathVariable userId: UUID,
        @RequestParam(required = true, value = "login") login: String,
        @RequestParam(required = true, value = "password") password: String) : UserAuthorizedEvent {
        return userEsService.update(userId) {
            it.authorizeUser(login, password)
        }
    }
}