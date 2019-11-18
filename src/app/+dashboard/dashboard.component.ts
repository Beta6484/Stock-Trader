import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { first } from 'rxjs/operators';
import { Stock } from '../models/stock';
import { User } from '../models/user';
import { AlertService } from '../services/alert/alert.service';
import { AuthService } from '../services/auth/auth.service';
import { OrderService } from '../services/order/order.service';
import { StockService } from '../services/stock-list/stock.service';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  public stockList: Stock[];
  public stock: any;
  public hasStock: boolean;
  public submitted: boolean = false;
  public offerForm: FormGroup;
  private _modalRef: BsModalRef;
  private _currentUser: User;
  
  constructor(
    private _title: Title,
    private _authService: AuthService,
    private _stockService: StockService,
    private _orderService: OrderService,
    private _alertService: AlertService,
    private _modalService: BsModalService,
    private _formBuilder: FormBuilder,
    private _router: Router
  ) {
    this._title.setTitle('Stock Trader - Dashboard');
    this._authService.currentUser.subscribe(user => {
      this._currentUser = user;
    })
  }
    
  ngOnInit(): void {
    this.loadAllStocks();
  }

  public get f() {
    return this.offerForm.controls;
  }

  private loadAllStocks() {
    this._stockService.getAll().pipe(first()).subscribe(stockList => {
      this.stockList = stockList;
      this.stockList.length > 0 ? this.hasStock = true : this.hasStock = false;
    })
  }

  public buyStockQuota(id: number, modal: TemplateRef<any>) {
    this._stockService.getById(id).pipe(first()).subscribe(stock => {
      this.stock = stock;

      this.offerForm = this._formBuilder.group({
        offer: ['', Validators.required],
        quantity: ['', [
          Validators.required, 
          Validators.minLength(1), 
          Validators.maxLength(this.stock.quantity)
        ]],
        stockId: this.stock.id,
        sellerId: this.stock.userId,
        buyerId: this._currentUser.id,
        aproved: false,
        aprovedOn: '',
        placedOn: new Date
      });

      this._modalRef = this._modalService.show(modal, {
        ignoreBackdropClick: true, 
        class: 'modal-sm'
      });
    });
  }

  public placeOrder() {
    this.submitted = true;

    if (this.offerForm.invalid) {
      return;
    }

    this._orderService.register(this.offerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this._alertService.success('Your order has been submitted successfully! Please wait for the approval of the seller.', true);
          this._router.navigate(['/orders']);
        },
        error => {
          this._alertService.error(error);
        }
      )

    this.stock = '';
    this._modalRef.hide();
  }

  public closeModal() {
    this.stock = '';
    this._modalRef.hide();
  }
}