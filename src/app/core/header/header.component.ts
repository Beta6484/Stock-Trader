import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {
  public showMenu: boolean = false;
  public currentUser: User;
  public currentUrl: string;
  public company: string;
  public funds: number;
  private _currentUserSubscription: Subscription;

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this._currentUserSubscription = this._authService.currentUser.subscribe(user => {
      this.currentUser = user;
    })
    this._router.events.subscribe(() => {
      this.currentUrl = this._router.url.substr(1);
    })
  }

  ngOnInit(): void {
    this.funds = this.currentUser.funds;
    this.company = this.currentUser.company;
  }

  ngOnDestroy(): void {
    this._currentUserSubscription.unsubscribe();
  }

  public logout() {
    this._authService.logout();
    this._router.navigate(['/login']);
  }

  public toggleMenu() {
    this.showMenu = !this.showMenu;
  }
}
