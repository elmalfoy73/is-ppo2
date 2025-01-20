package ru.quipy.repository

import org.springframework.data.mongodb.repository.MongoRepository
import ru.quipy.logic.MemberEntity
import java.util.*

interface MemberRepository : MongoRepository<MemberEntity, UUID> {
    fun findAllByProjectID(id: UUID): MutableList<MemberEntity>
    fun findAllByUserID(id: UUID): MutableList<MemberEntity>
}