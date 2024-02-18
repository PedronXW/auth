import { Message } from '@/domain/enterprise/entities/message'

export class MessagePresenter {
  static toHTTP(message: Message) {
    return {
      id: message.id.getValue(),
      text: message.text,
      creatorName: message.creatorName,
      creatorId: message.creatorId.getValue(),
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }
  }
}
