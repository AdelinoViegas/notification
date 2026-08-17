import { SSEConnection } from "../../../types";

export class SSEConnectionManager {
  private connections = new Map<
    string,
    Set<SSEConnection>
  >();

  addConnection(
    receiver: string,
    connection: SSEConnection
  ): void {
    const receiverConnections =
      this.connections.get(receiver) ?? new Set();

    receiverConnections.add(connection);

    this.connections.set(
      receiver,
      receiverConnections
    );
  }

  removeConnection(
    receiver: string,
    connection: SSEConnection
  ): void {
    const receiverConnections =
      this.connections.get(receiver);

    if (!receiverConnections) {
      return;
    }

    receiverConnections.delete(connection);

    if (receiverConnections.size === 0) {
      this.connections.delete(receiver);
    }
  }

  getConnections(
    receiver: string
  ): Set<SSEConnection> {
    return this.connections.get(receiver) ?? new Set();
  }
}