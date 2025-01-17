package ru.quipy.projections

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Autowired
import ru.quipy.api.TaskAggregate
import ru.quipy.api.TaskStatusSetEvent
import ru.quipy.streams.AggregateSubscriptionsManager
import javax.annotation.PostConstruct

class TaskEventsSubscriber {

    val logger: Logger = LoggerFactory.getLogger(TaskEventsSubscriber::class.java)

    @Autowired
    lateinit var subscriptionsManager: AggregateSubscriptionsManager

    @PostConstruct
    fun init() {
        subscriptionsManager.createSubscriber(TaskAggregate::class, "tasks-events-subscriber") {

            `when`(TaskStatusSetEvent::class) { event ->
                logger.info("Status {} assigned to task {}: ", event.statusName, event.taskId)
            }
        }
    }
}