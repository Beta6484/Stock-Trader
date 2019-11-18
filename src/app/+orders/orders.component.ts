import { Component, OnInit } from '@angular/core';
import { Order } from '../models/order';
import { Title } from '@angular/platform-browser';
import { OrderService } from '../services/order/order.service';
import { AuthService } from '../services/auth/auth.service';
import { User } from '../models/user';
import { filter, first } from 'rxjs/operators';
import { StockService } from '../services/stock-list/stock.service';
import { Stock } from '../models/stock';
import { merge, Observable, forkJoin } from 'rxjs';

@Component({
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})

export class OrdersComponent implements OnInit {
  public hasOrder: boolean;
  public orders: Order[];
  public stocks = [];
  public orderList = [];
  private _currentUser: User;

  constructor(
    private _title: Title,
    private _authService: AuthService,
    private _orderService: OrderService,
    private _stockService: StockService
  ) {
    this._title.setTitle('Stock Trader - Orders');
    this._authService.currentUser.subscribe(user => {
      this._currentUser = user;
    })
  }

  ngOnInit(): void {
    this.loadMyOrders();
  }

  private loadMyOrders() {
    this._orderService.getAll().pipe(first()).subscribe(orders => {
      this.orders = orders.filter(x => x.buyerId === this._currentUser.id);

      for(let i = 0; i < this.orders.length; i++) {
        this._stockService.getById(this.orders[i].stockId).pipe(first()).subscribe(stocks => {
          this.stocks.push(stocks);
        })
      }

      console.log('ORDERS: ', this.orders, typeof this.orders);
      console.log('STOCKS: ', this.stocks, typeof this.stocks);
    })
  }
}