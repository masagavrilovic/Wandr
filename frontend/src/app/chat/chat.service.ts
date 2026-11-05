import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ChatMessage } from './chat.models';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../shared/pagination.models';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/chat';

  getMessages(tripId: number, limit?: number, cursor?: number | null): Observable<PaginatedResponse<ChatMessage>> {
    let params = new HttpParams();
    if (limit) params = params.set('limit', limit);
    if (cursor) params = params.set('cursor', cursor);
    
    return this.http.get<PaginatedResponse<ChatMessage>>(`${this.baseUrl}/${tripId}`, { params });
  }
}