import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectCompanyInputComponent } from './components/select-company-input/select-company-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [SelectCompanyInputComponent],
  imports: [
    CommonModule ,ReactiveFormsModule , FormsModule ,NgSelectModule
  ],
  exports:[SelectCompanyInputComponent]
})
export class SharedModule { }
