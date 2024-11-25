import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/app';
  private token: string | null = null;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private username: string | null = null;

  constructor(private http: HttpClient) {}


  register(username: string, email: string, password: string): Observable<any> {
    const payload = { username, email, password };
    return this.http.post(`${this.baseUrl}/register/`, payload);
  }


  login(identifier: string, password: string): Observable<any> {
    const payload = { identifier, password };
    return this.http.post(`${this.baseUrl}/login/`, payload).pipe(
      tap((response: any) => {
        this.token = response.token;
        this.username = response.username;
        this.loggedIn.next(true);
      })
    );
    
  }


  logout(): void {
    this.token = null;
    this.username = null;
    this.loggedIn.next(false);
    console.log('User wylogowany');
  }


  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

   getUserName(): string | null {
    return this.username;
  }
}
