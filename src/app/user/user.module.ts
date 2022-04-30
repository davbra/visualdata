import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './views/login/login.component';
import { UserRoutingModule } from './user-routing.module';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule ,UserRoutingModule ,ReactiveFormsModule , FormsModule 
  ]
})
export class UserModule { }
