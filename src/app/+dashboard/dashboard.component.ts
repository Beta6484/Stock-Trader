import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ReplaySubject, Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Order } from '../models/order';
import { Stock } from '../models/stock';
import { User } from '../models/user';
import { AlertService } from '../services/alert/alert.service';
import { AuthService } from '../services/auth/auth.service';
import { StorageService } from '../services/storage/storage.service';
import { UserService } from '../services/user/user.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  public hasStock: boolean;
  public isLoading: boolean = true;
  public submitted: boolean = false;
  public offerForm: FormGroup;
  public stock: Stock = null;
  public stockList$: Subject<Stock[]> = new ReplaySubject<Stock[]>(1);
  public user$: Subject<User> = new ReplaySubject<User>(1);
  private _order: any;
  private _modalRef: BsModalRef;
  
  constructor(
    private _title: Title,
    private _authService: AuthService,
    private _userService: UserService,
    private _storageService: StorageService,
    private _alertService: AlertService,
    private _modalService: BsModalService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this._title.setTitle('Stock Trader - Dashboard');
    
    this._userService.getById(this._authService.currentUserValue.id).pipe(first()).subscribe(user => {
      this.user$.next(user);
    });
  }
    
  ngOnInit(): void {
    this._getStockList();
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
    this.stockList$.unsubscribe();
  }

  private _getStockList() {
    if (this._storageService.getStorageByKey('stock-list') === null || this._storageService.getStorageByKey('stock-list').length === 0) {
      this.hasStock = false;
      this.isLoading = false;
      return;
    }
    
    this.stockList$.next(this._storageService.getStorageByKey('stock-list').reverse());
    this.hasStock = true;
    this.isLoading = false;
  }
  
  public get f() {
    return this.offerForm.controls;
  }

  public buyStockQuota(id: number, modal: TemplateRef<any>) {
    this.user$.pipe(first()).subscribe(user => {
      this.stock = this._storageService.getStorageByKey('stock-list').filter(x => x.id === id)[0];
  
      this.offerForm = this._formBuilder.group({
        offer: ['', Validators.required],
        quantity: ['', [
          Validators.required, 
          Validators.min(1), 
          Validators.max(this.stock.quantity)
        ]]
      });

      let newOrder = [{
        id: this._storageService.getStorageByKey('orders') !== null ? this._storageService.getStorageByKey('orders').length + 1 : 1,
        stockId: this.stock.id,
        sellerId: this.stock.userId,
        sellerCompany: this.stock.userCompany,
        buyerId: user.id,
        buyerCompany: user.company,
        aproved: false,
        revisedOn: '',
        placedOn: Date()
      }];

      this._order = newOrder[0];
    });

    this._modalRef = this._modalService.show(modal, {
      ignoreBackdropClick: true, 
      class: 'modal-sm'
    });
  }

  public placeOrder() {
    this.submitted = true;

    if (this.offerForm.invalid) {
      return;
    }

    let orders: Order[] = this._storageService.getStorageByKey('orders') ||[];
    let newOrder = {...this._order, ...this.offerForm.value}
    orders.push(newOrder);
    this._storageService.store('orders', orders);
    this._alertService.success('Your order has been submitted successfully! Please wait for the approval of the seller.', true);
    this._router.navigate(['/orders']);
    this._modalRef.hide();
  }

  public closeModal() {
    this._modalRef.hide();
  }
}