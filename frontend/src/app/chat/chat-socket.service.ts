import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({ providedIn: 'root' })
export class ChatSocketService {
  private readonly socket: Socket = io(`http://localhost:3000/chat`, {
    autoConnect: false,
    withCredentials: true,
    transports: ['websocket'],
  });

  connect(): Observable<void> {
    return new Observable<void>((subscriber) => {
      const onConnect = () => subscriber.next();
      this.socket.on('connect', onConnect);
      if (this.socket.connected) subscriber.next();
      else this.socket.connect();

      return () => {
        this.socket.off('connect', onConnect);
        this.socket.disconnect();
      };
    });
  }

  retry() {
    if (!this.socket.connected) this.socket.connect();
  }

  on<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      const handler = (data: T) => subscriber.next(data);
      this.socket.on(event, handler);
      return () => {
        this.socket.off(event, handler);
      };
    });
  }

  emit(event: string, payload: unknown) {
    this.socket.emit(event, payload);
  }

  joinTrip(tripId: number): Observable<void> {
    return new Observable<void>((subscriber) => {
      this.socket.timeout(5000).emit('trip:join', { tripId }, (err: Error | null) => {
        if (err) subscriber.error(err);
        else {
          subscriber.next();
          subscriber.complete();
        }
      });
    });
  }
}