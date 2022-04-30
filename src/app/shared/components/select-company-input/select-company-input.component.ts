import { take } from 'rxjs/operators';
import { Validators } from '@angular/forms';
import { SelectCompanyInputFormInterface } from './../../form-interfaces/select-company-input.form-interface';
import { CompanyDto } from './../../dtos/company.dto';
import { Component, Input, OnInit } from '@angular/core';
import { CompanyService } from '../../services/company.service';
import { FormBuilder, FormGroup } from '@ng-stack/forms';

@Component({
  selector: 'app-select-company-input',
  templateUrl: './select-company-input.component.html',
  styleUrls: ['./select-company-input.component.scss']
})
export class SelectCompanyInputComponent implements OnInit {

  rForm: FormGroup<SelectCompanyInputFormInterface>;
  companyArr: CompanyDto[];

  @Input() isRequired: boolean = false;
  @Input() set selectedCompanyIdSetter(companyIdArr: any[]) {
    this.clearData();
    if (companyIdArr != null) {
      this._CompanyService.getAll(null).pipe(take(1)).subscribe(allCompanyArr => {
        var arr = allCompanyArr.filter(x => companyIdArr.indexOf(x.id) > -1);
        this.rForm.controls.selectedCompanyArr.setValue(arr);
      })
    }
  }

  constructor(private _CompanyService: CompanyService, private _FormBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.rForm = this._FormBuilder.group<SelectCompanyInputFormInterface>({
      companyId: [null],
      selectedCompanyArr: [null]
    });
  }

  searchCompany(text) {
    this._CompanyService.search(text, null, this.getSelectedCompanyIdArr()).subscribe(arr => {
      this.companyArr = arr;
    });
  }

  onChange(item: CompanyDto) {
    this.rForm.controls.companyId.setValue(null);
    this.setSelectedCompany(item);
    this.companyArr = [];
  }

  deleteCompany(index) {
    var arr: CompanyDto[] = this.rForm.value.selectedCompanyArr;
    arr.splice(index, 1);
    this.rForm.controls.selectedCompanyArr.setValue(arr);
  }

  getSelectedCompanyIdArr() {
    var selectedCompanyArr: CompanyDto[] = this.rForm.value.selectedCompanyArr == null ? [] : this.rForm.value.selectedCompanyArr;
    return selectedCompanyArr.map(x => x.id);
  }

  clearData() {
    if (this.rForm != undefined) {
      this.rForm.reset();
    }
    this.companyArr = [];
  }

  private setSelectedCompany(item: CompanyDto) {
    var selectedCompanyArr: CompanyDto[] = this.rForm.value.selectedCompanyArr == null ? [] : this.rForm.value.selectedCompanyArr;
    selectedCompanyArr.push(item);
    this.rForm.controls.selectedCompanyArr.setValue(selectedCompanyArr);
  }

}
