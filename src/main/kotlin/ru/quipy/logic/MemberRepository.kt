package ru.quipy.logic

import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface MemberRepository : JpaRepository<MemberEntity, UUID> {
    fun findAllByProjectID(id: UUID): MutableList<MemberEntity>
    fun findAllByUserID(id: UUID): MutableList<MemberEntity>
}