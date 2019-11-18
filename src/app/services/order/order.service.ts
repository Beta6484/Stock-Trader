import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from 'src/app/models/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  constructor(
    private _httpClient: HttpClient
  ) { }

  getAll() {
    return this._httpClient.get<Order[]>(`${environment.apiUrl}/orders`);
  }

  getById(id: number) {
      return this._httpClient.get(`${environment.apiUrl}/orders/${id}`);
  }

  register(order: Order) {
      return this._httpClient.post(`${environment.apiUrl}/orders/register`, order);
  }
}