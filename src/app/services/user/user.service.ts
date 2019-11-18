import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll() {
    return this._httpClient.get < User[] > (`${environment.apiUrl}/users`);
  }

  getById(id: number) {
    return this._httpClient.get(`${environment.apiUrl}/users/${id}`);
  }

  register(user: User) {
    return this._httpClient.post(`${environment.apiUrl}/users/register`, user);
  }

  update(user: User) {
    return this._httpClient.put(`${environment.apiUrl}/users/${user.id}`, user);
  }

  delete(id: number) {
    return this._httpClient.delete(`${environment.apiUrl}/users/${id}`);
  }
}
