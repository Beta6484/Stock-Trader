import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Stock } from 'src/app/models/stock';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  constructor(
    private _httpClient: HttpClient
  ) {}

  getAll() {
    return this._httpClient.get < Stock[] > (`${environment.apiUrl}/stock-list`);
  }

  getById(id: number) {
    return this._httpClient.get(`${environment.apiUrl}/stock-list/${id}`);
  }

  update(stock: Stock) {
    return this._httpClient.put(`${environment.apiUrl}/stock-list/${stock.id}`, stock);
  }
}