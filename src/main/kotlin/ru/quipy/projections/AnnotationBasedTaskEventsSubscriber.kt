package ru.quipy.projections;

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service;
import ru.quipy.api.TaskAggregate;
import ru.quipy.api.TaskCreatedEvent
import ru.quipy.streams.annotation.AggregateSubscriber;
import ru.quipy.streams.annotation.SubscribeEvent;

@Service
@AggregateSubscriber(
    aggregateClass = TaskAggregate::class, subscriberName = "demo-subs-stream"
)
public class AnnotationBasedTaskEventsSubscriber {

    val logger: Logger = LoggerFactory.getLogger(AnnotationBasedProjectEventsSubscriber::class.java)

    @SubscribeEvent
    fun taskCreatedSubscriber(event: TaskCreatedEvent) {
        logger.info("Task created: {}", event.taskName)
    }
}
