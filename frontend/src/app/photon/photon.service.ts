import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationResult } from './photon.models';

@Injectable({ providedIn: 'root' })
export class PhotonService {
  constructor(private http: HttpClient) {}

  autocomplete(query: string): Observable<LocationResult[]> {
    return this.http.get<LocationResult[]>('http://localhost:3000/photon/autocomplete', { params: { q: query }});
  }
}