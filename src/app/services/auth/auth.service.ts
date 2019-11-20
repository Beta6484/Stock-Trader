import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  public currentUser: Observable<User> ;
  private _currentUserSubject: BehaviorSubject<User> ;

  constructor(
    private _httpClient: HttpClient,
    private _storageService: StorageService
    ) {
    this._currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
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
    let users: User[] = this._storageService.getStorageByKey('users');
    let user: User = users.filter(x => x.id === this._currentUserSubject.value.id)[0];
    
    user.lastLogin = Date();
    users.splice(users.indexOf(user), 1, user);
    localStorage.removeItem('currentUser');
    this._storageService.store('users', users);
    this._currentUserSubject.next(null);
  }
}