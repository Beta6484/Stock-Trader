import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Order } from '../models/order';
import { Stock } from '../models/stock';
import { User } from '../models/user';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { UserService } from '../services/user/user.service';

@Component({
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  public hasOrder: boolean;
  public isLoading: boolean = true;
  public orderList$: Subject<Order[]> = new ReplaySubject<Order[]>(1);
  public user$: Subject<User> = new ReplaySubject<User>(1);

  constructor(
    private _title: Title,
    private _authService: AuthService,
    private _userService: UserService,
    private _storageService: StorageService
  ) {
    this._title.setTitle('Stock Trader - Orders');
    
    this._userService.getById(this._authService.currentUserValue.id).pipe(first()).subscribe(user => {
      this.user$.next(user);
    });
  }

  ngOnInit(): void {
    this._getMyOrders();
  }

  ngOnDestroy(): void {
    this.orderList$.unsubscribe();
    this.user$.unsubscribe();
  }

  private _getMyOrders() {
    this.user$.pipe(first()).subscribe(user => {
      if(localStorage.getItem('orders') === null) {
        this.hasOrder = false;
        this.isLoading = false;
        return;
      }

      const myOrders: Order[] = this._storageService.getStorageByKey('orders').filter(x => x.buyerId === user.id);
      let currentList = [];

      if(myOrders.length == 0) {
        this.hasOrder = false;
        this.isLoading = false;
        return;
      }

      for (let i = 0; i < myOrders.length; i++) {
        const order: Order = myOrders[i];
        const stock: Stock = this._storageService.getStorageByKey('stock-list').filter(x => x.id === order.stockId)[0];
        const orderInfo = {
          id: order.id,
          stockId: order.stockId,
          sellerCompany: order.sellerCompany,
          offered: order.offer,
          qtdOrdered: order.quantity,
          aproved: order.aproved,
          revisedOn: order.revisedOn,
          placedOn: order.placedOn,
          currentPrice: stock.price,
          qtdAvaiable: stock.quantity,
          company: stock.company,
          symbol: stock.symbol
        }

        currentList = currentList.concat(orderInfo);
      }

      currentList.reverse();
      this.orderList$.next(currentList);
      this.hasOrder = true;
      this.isLoading = false;
    })  
  }
}