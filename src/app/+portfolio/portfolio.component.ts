import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Stock } from '../models/stock';
import { User } from '../models/user';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { UserService } from '../services/user/user.service';

@Component({
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit, OnDestroy {
  public hasStock: boolean;
  public isLoading: boolean = true;
  public stockList$: Subject<Stock[]> = new ReplaySubject<Stock[]>(1);
  public user$: Subject<User> = new ReplaySubject<User>(1);

  constructor(
    private _title: Title,
    private _authService: AuthService,
    private _userService: UserService,
    private _storageService: StorageService
  ) {
    this._title.setTitle('Stock Trader - Portfolio');
    
    this._userService.getById(this._authService.currentUserValue.id).pipe(first()).subscribe(user => {
      this.user$.next(user);
    });
  }

  ngOnInit(): void {
    this._getPortfolio();
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
    this.stockList$.unsubscribe();
  }

  private _getPortfolio() {
    this.user$.pipe(first()).subscribe(user => {
      const portfolio: Stock[] = this._storageService.getStorageByKey('stock-list').filter(x => x.userId === user.id);
      
      if (portfolio.length == 0) {
        this.hasStock = false;
        this.isLoading = false;
        return;
      }

      this.stockList$.next(portfolio.reverse());
      this.hasStock = true;
      this.isLoading = false;
    })
  }
}
