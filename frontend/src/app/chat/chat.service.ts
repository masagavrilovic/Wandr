import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ChatMessage } from './chat.models';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/chat';

  getMessages(tripId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}/${tripId}`);
  }
}