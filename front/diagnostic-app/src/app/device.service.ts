import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private baseUrl = 'http://127.0.0.1:8000/app/devices';

  constructor(private http: HttpClient) { }

 

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }
  

  addDevice(device: any) {
    const headers = this.getAuthHeaders(); 
    return this.http.post(`${this.baseUrl}/add/`, device, { headers})
  }
}
