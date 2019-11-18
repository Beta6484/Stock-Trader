import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private _currentUserSubject: BehaviorSubject < User > ;
  public currentUser: Observable < User > ;

  constructor(
    private _httpClient: HttpClient
    ) {
    this._currentUserSubject = new BehaviorSubject < User > (JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this._currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this._currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this._httpClient.post < any > (`${environment.apiUrl}/users/authenticate`, {
        username,
        password
      })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this._currentUserSubject.next(user);
        }

        return user;
      }));
  }

  logout() {
    localStorage.removeItem('currentUser');
    this._currentUserSubject.next(null);
  }
}