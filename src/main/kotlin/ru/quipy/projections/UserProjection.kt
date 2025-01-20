package ru.quipy.projections

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service
import ru.quipy.api.UserAggregate
import ru.quipy.api.UserCreatedEvent
import ru.quipy.api.UserUpdatedEvent
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.UserAggregateState
import ru.quipy.logic.UserEntity
import ru.quipy.repository.UserRepository
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct

@Service
class UserProjection(
    private val userRepository: UserRepository,
    private val subManager: AggregateSubscriptionsManager,
    private val userEsService: EventSourcingService<UUID, UserAggregate, UserAggregateState>
) {

    @PostConstruct
    fun init() {
        subManager.createSubscriber(UserAggregate::class, "user:user-projection") {
            `when`(UserCreatedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    userRepository.save(
                        UserEntity(
                            event.userID,
                            event.login,
                            event.password
                        )
                    )
                }
            }
            `when`(UserUpdatedEvent::class) { event ->
                withContext(Dispatchers.IO) {
                    userRepository.save(
                        UserEntity(
                            event.userID,
                            event.login,
                            event.password
                        )
                    )
                }
            }
        }
    }

    fun findUserByLogin(login: String): List<UserEntity> {
        return userRepository.findByLogin(login)
    }
}