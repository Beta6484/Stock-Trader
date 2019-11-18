import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Title } from '@angular/platform-browser';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public loading: boolean = false;
  public submitted: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _authService: AuthService,
    private _userService: UserService,
    private _alertService: AlertService,
    private _title: Title
  ) {
    this._title.setTitle('Stock Trader - Register');

    if (this._authService.currentUserValue) {
      this._router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this._formBuilder.group({
      username: ['', [
        Validators.required, Validators.minLength(4),
        Validators.maxLength(20),
        Validators.pattern('^[A-Za-z][A-Za-z0-9]*$')
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.maxLength(20)
      ]],
      company: ['', [
        Validators.required, 
        Validators.minLength(4), 
        Validators.maxLength(40)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      funds: [50000]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this._userService.register(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this._alertService.success('Successfully registered, please login!', true);
          this._router.navigate(['/login']);
        },
        error => {
          this._alertService.error(error);
          this.loading = false;
        }
      )
  }
}
