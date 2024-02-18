import { EntityId } from '@/@shared/entities/entity-id'
import { Message } from '@/domain/enterprise/entities/message'

export type MessagePersistence = {
  id: string
  creatorId: string
  text: string
  creatorName: string
  createdAt: Date | null
  updatedAt?: Date | null
}

export class MessageMapper {
  static toPersistence(message: Message): MessagePersistence {
    return {
      id: message.id.getValue(),
      text: message.text,
      creatorId: message.creatorId.getValue(),
      creatorName: message.creatorName,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }
  }

  static toDomain(message): Message {
    const newMessage = Message.create(
      {
        text: message.text,
        creatorId: new EntityId(message.creatorId),
        creatorName: message.creatorName,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      },
      new EntityId(message.id),
    )
    return newMessage
  }
}
