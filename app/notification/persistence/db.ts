import { getDatabase } from "../../database/mongo";
import { NotificationRepository } from "./repository";
import { NotificationEvent } from "../../types";

export class MongoNotificationRepository implements NotificationRepository {
  private collectionName = "notifications";

  async create(
    notification: NotificationEvent
  ): Promise<void> {
    const db = await getDatabase();

    await db.collection(this.collectionName).insertOne({
      ...notification,
      read: false,
      createdAt: new Date(),
    });
  }

  async findUnreadByReceiver(
    receiver: string
  ): Promise<NotificationEvent[]> {
    const db = await getDatabase();

    return db
      .collection<NotificationEvent>(this.collectionName)
      .find({
        receiver,
        read: false,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();
  }

  async markAsRead(
    notificationId: string
  ): Promise<void> {
    const db = await getDatabase();

    await db.collection(this.collectionName).updateOne(
      {
        id: notificationId,
      },
      {
        $set: {
          read: true,
          readAt: new Date(),
        },
      }
    );
  }
}