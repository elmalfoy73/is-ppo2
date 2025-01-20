package ru.quipy.projections

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import ru.quipy.api.*
import ru.quipy.core.EventSourcingService
import ru.quipy.logic.UserAggregateState
import ru.quipy.repository.TaskRepository
import ru.quipy.repository.UserTasksRepository
import ru.quipy.streams.AggregateSubscriptionsManager
import java.util.*
import javax.annotation.PostConstruct

@Service
class UserEventsSubscriber(
    val subscriptionsManager: AggregateSubscriptionsManager,
    val userTasksRepository: UserTasksRepository,
    ) {
    val logger: Logger = LoggerFactory.getLogger(UserEventsSubscriber::class.java)

    @PostConstruct
    fun init() {
        subscriptionsManager.createSubscriber(UserAggregate::class, "user-aggregate") {

            `when`(UserCreatedEvent::class) { event ->
                userTasksRepository.save(
                    UserTasksProjection(
                        event.userID,
                        event.login,
                        emptyList()
                    )
                )
                logger.info("User created: {}", event.login)
            }

            `when`(UserAuthorizedEvent::class) { event ->
                logger.info("User authorized: {}", event.login)
            }

            `when`(UserUpdatedEvent::class) { event ->
                logger.info("User updated: {}", event.login)
            }
        }
    }
}