import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Order } from '../models/order';
import { OrderInfo } from '../models/orderInfo';
import { Stock } from '../models/stock';
import { User } from '../models/user';
import { AlertService } from '../services/alert/alert.service';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { UserService } from '../services/user/user.service';

@Component({
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.scss']
})

export class ProposalsComponent implements OnInit, OnDestroy {
  public hasProposal: boolean;
  public isLoading: boolean = true;
  public proposalList$: Subject<OrderInfo[]> = new ReplaySubject<OrderInfo[]>(1);
  public user$: Subject<User> = new ReplaySubject<User>(1);

  constructor(
    private _title: Title,
    private _authService: AuthService,
    private _userService: UserService,
    private _storageService: StorageService,
    private _alertService: AlertService
  ) {
    this._title.setTitle('Stock Trader - Proposals');
    
    this._userService.getById(this._authService.currentUserValue.id).pipe(first()).subscribe(user => {
      this.user$.next(user);
    });
  }

  ngOnInit(): void {
    this._getMyProposals();
  }

  ngOnDestroy(): void {
    this.proposalList$.unsubscribe();
    this.user$.unsubscribe();
  }

  private _getMyProposals() {
    this.user$.pipe(first()).subscribe(user => {
      if (localStorage.getItem('orders') === null) {
        this.hasProposal = false;
        this.isLoading = false;
        return;
      }

      const myProposals: Order[] = this._storageService.getStorageByKey('orders').filter(x => x.sellerId === user.id);
      
      if (myProposals.length == 0) {
        this.hasProposal = false;
        this.isLoading = false;
        return;
      }
      
      let currentList = [];
      
      for (let i = 0; i < myProposals.length; i++) {
        const proposal: Order = myProposals[i];
        const stock: Stock = this._storageService.getStorageByKey('stock-list').filter(x => x.id === proposal.stockId)[0];
        const proposalInfo = {
          id: proposal.id,
          stockId: proposal.stockId,
          buyerCompany: proposal.buyerCompany,
          offered: proposal.offer,
          qtdOrdered: proposal.quantity,
          aproved: proposal.aproved,
          revisedOn: proposal.revisedOn,
          placedOn: proposal.placedOn,
          currentPrice: stock.price,
          qtdAvaiable: stock.quantity,
          company: stock.company,
          symbol: stock.symbol
        }

        currentList = currentList.concat(proposalInfo);
      }
      
      currentList.reverse()
      this.proposalList$.next(currentList);
      this.hasProposal = true;
      this.isLoading = false;
    });
  }

  public rejectProposal(id: number) {
    let orders: Order[] = this._storageService.getStorageByKey('orders');
    const proposal: Order = orders.filter(x => x.id === id)[0];
    const index = orders.indexOf(proposal);
    
    proposal.revisedOn = Date();

    orders.splice(index, 1, proposal);

    this._storageService.store('orders', orders);
    this._getMyProposals();
  }

  public aproveProposal(id: number) {
    this.user$.pipe(first()).subscribe(user => {
      let users: User[] = this._storageService.getStorageByKey('users');
      let stockList: Stock[] = this._storageService.getStorageByKey('stock-list');
      let orders: Order[] = this._storageService.getStorageByKey('orders');
      let proposal: Order = orders.filter(x => x.id === id)[0];
      let buyer: User = users.filter(x => x.id === proposal.buyerId)[0];
      let seller: User = users.filter(x => x.id === proposal.sellerId)[0];
      let stock: Stock = stockList.filter(x => x.id === proposal.stockId)[0];
      let newStock: Stock;
      
      if (stock.quantity < proposal.quantity) {
        this._alertService.error('Not enough stock quantity to confirm this sale.', true);
        return;
      }

      if ((proposal.quantity * proposal.offer) > user.funds) {
        this._alertService.error('Insufficient funds.', true);
        return;
      }
      
      proposal.revisedOn = Date();
      proposal.aproved = true;
      orders.splice(orders.indexOf(proposal), 1, proposal);
  
      seller.funds = seller.funds + (proposal.offer * proposal.quantity);
      buyer.funds = buyer.funds - (proposal.offer * proposal.quantity);
      users.splice(users.indexOf(seller), 1, seller);
      users.splice(users.indexOf(buyer), 1, buyer);
  
      stock.quantity = stock.quantity - proposal.quantity;
      newStock = {
        id: stockList.length + 1,
        userId: proposal.buyerId,
        userCompany: buyer.company,
        company: stock.company,
        symbol: stock.symbol,
        quantity: proposal.quantity,
        price: proposal.offer
      };

      if(stock.quantity === proposal.quantity) {
        delete stockList[stockList.indexOf(stock)];  
      } else {
        stockList.splice(stockList.indexOf(stock), 1, stock);
      }
      
      stockList.push(newStock);
      
      this._storageService.store('orders', orders);
      this._storageService.store('users', users);
      this._storageService.store('stock-list', stockList);
      this._getMyProposals();
    });
  }
}