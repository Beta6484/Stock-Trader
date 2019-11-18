import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public currYear: any;
  public users = [];
  public stockList = [];

  constructor(
    private _router: Router
  ) {
    this.currYear = new Date().getFullYear();
    this.users = JSON.parse(localStorage.getItem('users')) || [];
    this.stockList = JSON.parse(localStorage.getItem('stock-list')) || [];
  }
  
  public importFakeData() {
    const fakeUserData = {id: 0, username: 'fakecustomer', email: 'fakecustomer@fakecustomer.com', company: 'Fake Customer Inc.', funds: 50000, token: 'fake-token'};

    const fakeStockData = [{id: 0, userId: 0, company: "Microsoft Corp", symbol: "MSFT", quantity: 100, price: 400, min: 500, max: 700}, {id: 1, userId: 0, company: "Google", symbol: "GOGL", quantity: 56, price: 201, min: 120, max: 300}, {id: 2, userId: 0, company: "Facebook Inc", symbol: "FBOK", quantity: 39, price: 120, min: 90, max: 220}, {id: 3, userId: 0, company: "Apple", symbol: "APLE", quantity: 220, price: 80, min: 75, max: 89}, {id: 4, userId: 0, company: "Twitter", symbol: "TWTR", quantity: 13, price: 52, min: 47, max: 59}, {id: 5, userId: 0, company: "LinkedIn", symbol: "LNKD", quantity: 45, price: 153, min: 110, max: 190}, {id: 6, userId: 0, company: "B2W Companhia Digital", symbol: "BTOW", quantity: 136, price: 87, min: 60, max: 130}, {id: 7, userId: 0, company: "Banco do Brasil S.A.", symbol: "BBAS", quantity: 80, price: 300, min: 285, max: 413}, {id: 8, userId: 0, company: "BR Malls Participações S.A.", symbol: "BRML", quantity: 80, price: 300, min: 285, max: 413}, {id: 9, userId: 0, company: "Conservas Oderich S.A.", symbol: "ODER", quantity: 200, price: 67, min: 35, max: 80}, {id: 10, userId: 0, company: "Evora S.A.", symbol: "PTPA", quantity: 680, price: 230, min: 160, max: 300}, {id: 11, userId: 0, company: "GoPro Inc", symbol: "GPRO", quantity: 23, price: 180, min: 100, max: 220}];

    this.users.push(fakeUserData);
    localStorage.setItem('users', JSON.stringify(this.users));
    
    this.stockList = this.stockList.concat(fakeStockData);
    localStorage.setItem('stock-list', JSON.stringify(this.stockList));

    this._router.navigate(['']);
    window.location.reload();
  }

  public clearFakeData() {
    if (this.users.length > 1) {
      this.users.pop();
      localStorage.setItem('users', JSON.stringify(this.users));
    }
  }
}
