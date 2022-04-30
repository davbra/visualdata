import { AuthService } from './../../../shared/services/auth.service';
import { LoginModel } from './../../../shared/models/login.model';
import { LoginFormInterface } from './../../../shared/form-interfaces/login.form-interface';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@ng-stack/forms';
import { RoleEnum } from 'src/app/shared/enums/role.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  rForm: FormGroup<LoginFormInterface>;

  @ViewChild("nForm", { static: false }) nForm: NgForm;

  constructor(private _FormBuilder: FormBuilder, private _AuthService: AuthService,
    private _Router: Router) {
  }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<LoginFormInterface>({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    if (this._AuthService.isAuthenticated == true) {
      if (this._AuthService.userRole == RoleEnum.Client) {
        this._Router.navigateByUrl('/admin/landing-page');
      } else if (this._AuthService.userRole == RoleEnum.Editor) {
        this._Router.navigateByUrl('/admin/analytics-editor');
      }
    }
  }

  login() {
    const formValue = this.rForm.value;
    var loginModel: LoginModel = {
      UserName: formValue.userName,
      Password: formValue.password
    }
    this._AuthService.login(loginModel).subscribe(model => {
      if (model.role == RoleEnum.Client) {
        this._Router.navigateByUrl('/admin/landing-page');
      } else if (model.role == RoleEnum.Editor) {
        this._Router.navigateByUrl('/admin/analytics-editor');
      }
    });
  }

}
