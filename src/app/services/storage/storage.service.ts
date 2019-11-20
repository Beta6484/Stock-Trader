import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { share } from 'rxjs/operators';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})

export class StorageService implements OnDestroy {
  private _usersSubject: BehaviorSubject<User[]>;
  private _onSubject = new Subject<{ key: string, value: any }>();
  public usersObs: Observable<User[]>;
  public changes = this._onSubject.asObservable().pipe(share());

  constructor() {
    this._start();
    this._usersSubject = new BehaviorSubject<User[]>(JSON.parse(localStorage.getItem('users')));
    this.usersObs = this._usersSubject.asObservable().pipe(share());
  }

  ngOnDestroy(): void {
    this._stop();
  }

  public getStorage() {
    let s = [];
    for (let i = 0; i < localStorage.length; i++) {
      s.push({
        key: localStorage.key(i),
        value: JSON.parse(localStorage.getItem(localStorage.key(i)))
      });
    }
    return s;
  }

  public getStorageByKey(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  public store(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
    this._onSubject.next({ key: key, value: data})
  }

  public clear(key: string) {
    localStorage.removeItem(key);
    this._onSubject.next({ key: key, value: null });
  }

  private _start(): void {
    window.addEventListener('storage', this._storageEventListener.bind(this));
  }

  private _storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      let v;
      try { v = JSON.parse(event.newValue); }
      catch (e) { v = event.newValue; }
      this._onSubject.next({ key: event.key, value: v });
    }
  }

  private _stop(): void {
    window.removeEventListener('storage', this._storageEventListener.bind(this));
    this._onSubject.complete();
  }
}