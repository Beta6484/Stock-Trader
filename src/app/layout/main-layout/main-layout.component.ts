import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  templateUrl: './main-layout.component.html'
})

export class MainLayoutComponent {
  private _fakeUserForm: FormGroup;

  constructor(
    private _userService: UserService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('stock-list') === null) {
      this._createFakeUser();
      this._importFakeData();
    }
  }

  private _createFakeUser() {
    this._fakeUserForm = this._formBuilder.group({
      username: 'fakecustomer',
      password: '123456789',
      company: 'Fake Customer Inc.',
      email: 'fakecustomer@fakecustomer.com',
      funds: 50000,
      lastLogin: Date()
    });

    this._userService.register(this._fakeUserForm.value)
      .pipe(first())
      .subscribe(data => console.log('*** Fake user successfully imported! ***'));
  }
  
  private _importFakeData() {
    const fakeStockData = [{id:0,userId:2,userCompany:"Fake Customer Inc.",company:"Microsoft Corp",symbol:"MSFT",quantity:100,price:400},{id:1,userId:2,userCompany:"Fake Customer Inc.",company:"Google",symbol:"GOGL",quantity:56,price:201},{id:2,userId:2,userCompany:"Fake Customer Inc.",company:"Facebook Inc",symbol:"FBOK",quantity:39,price:120},{id:3,userId:2,userCompany:"Fake Customer Inc.",company:"Apple",symbol:"APLE",quantity:220,price:80},{id:4,userId:2,userCompany:"Fake Customer Inc.",company:"Twitter",symbol:"TWTR",quantity:13,price:52},{id:5,userId:2,userCompany:"Fake Customer Inc.",company:"LinkedIn",symbol:"LNKD",quantity:45,price:153},{id:6,userId:2,userCompany:"Fake Customer Inc.",company:"B2W Companhia Digital",symbol:"BTOW",quantity:136,price:87},{id:7,userId:2,userCompany:"Fake Customer Inc.",company:"Banco do Brasil S.A.",symbol:"BBAS",quantity:80,price:300},{id:8,userId:2,userCompany:"Fake Customer Inc.",company:"BR Malls Participações S.A.",symbol:"BRML",quantity:80,price:300},{id:9,userId:2,userCompany:"Fake Customer Inc.",company:"Conservas Oderich S.A.",symbol:"ODER",quantity:200,price:67},{id:10,userId:2,userCompany:"Fake Customer Inc.",company:"Evora S.A.",symbol:"PTPA",quantity:680,price:230},{id:11,userId:2,userCompany:"Fake Customer Inc.",company:"GoPro Inc",symbol:"GPRO",quantity:23,price:180}];
    
    localStorage.setItem('stock-list', JSON.stringify(fakeStockData));
    console.log('*** Fake data successfully imported! ***');
  }
}
