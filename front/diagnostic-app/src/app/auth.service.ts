import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:8000/app';
  private token: string = '';
  private loggedIn = new BehaviorSubject<boolean>(false);
  private username: string | null = null;

  constructor(private http: HttpClient) {}
 

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token') as string;
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

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
        localStorage.setItem('auth_token', this.token);
      })
    );
  }

  logout(): void {
    this.token = '';
    this.username = null;
    this.loggedIn.next(false);
    localStorage.removeItem('auth_token');
    console.log('User wylogowany');
  }

  isLoggedIn(): Observable<boolean> {
    const token = localStorage.getItem('auth_token');
    this.loggedIn.next(!!token);
    return this.loggedIn.asObservable();
  }

  getUserName(): string | null {
    return this.username;
  }
}
