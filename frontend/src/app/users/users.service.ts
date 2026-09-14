import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { User } from "./users.models";

@Injectable({ providedIn: 'root'})
export class UsersService {
    private http = inject(HttpClient);
    private baseUrl = 'http://localhost:3000/users';

    me(): Observable<User> {
        return this.http.get<User>(`${this.baseUrl}/me`);
    }
}