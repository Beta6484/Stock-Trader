import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { first } from 'rxjs/operators';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  public showMenu: boolean = false;
  public hasOrders: boolean = false;
  public hasProposals: boolean = false;
  public currentUrl: string;
  public user$ = new Subject<User>();

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _storageService: StorageService,
    private _alertService: AlertService,
    private _router: Router
  ) {
    this._router.events.subscribe(() => {
      this.currentUrl = this._router.url.substr(1);
    })
  }

  ngOnInit(): void {
    this._userService.getById(this._authService.currentUserValue.id).pipe(first()).subscribe(user => {
      this.user$.next(user);

      const orders: Order[] = this._storageService.getStorageByKey('orders') || [];
      const myOrders: Order[] = orders.filter(x => x.buyerId === user.id) || [];
      const myProposals: Order[] = orders.filter(x => x.sellerId === user.id) || [];
      let numOrders: number = 0;
      let numProposals: number = 0;

      for (let i = 0; i < myOrders.length; i++) {
        if (myOrders[0].revisedOn > user.lastLogin) {
          numOrders = numOrders + 1;
        }
      }

      for (let i = 0; i < myProposals.length; i++) {
        if (myProposals[0].placedOn > user.lastLogin) {
          numProposals = numOrders + 1;
        }
      }

      if (numOrders > 0) {
        this._alertService.warning('You have new orders reviewed. Visit the orders link!', true);
      }

      if (numProposals > 0) {
        this._alertService.warning('You have new proposals to review. Visit the proposals link!', true);
      }
    });
  }

  public logout() {
    this.user$.unsubscribe();
    this._authService.logout();
    this._router.navigate(['/login']);
  }

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
