import { SharedModule } from './../shared/shared.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { HeaderComponent } from './layouts/header/header.component';
import { HeaderDetailsComponent } from './layouts/header-details/header-details.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { AnalyticsComponent } from './views/analytics/analytics.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddAnalyticsPopupComponent } from './components/add-analytics-popup/add-analytics-popup.component';
import { MatSortModule } from '@angular/material/sort';
import { AnalyticsEditorComponent } from './views/analytics-editor/analytics-editor.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AddReportDetailsPopupComponent } from './components/add-report-details-popup/add-report-details-popup.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { PageTitleComponent } from './layouts/page-title/page-title.component';
import { AnalyticsDetailsFoldDivComponent } from './components/analytics-details-fold-div/analytics-details-fold-div.component';
import { AddAnalyticsDetailsDescriptionPopupComponent } from './components/add-analytics-details-description-popup/add-analytics-details-description-popup.component';
import { AddCompanyPopupComponent } from './components/add-company-popup/add-company-popup.component';
import { CompaniesComponent } from './views/companies/companies.component';

@NgModule({
  declarations: [AdminComponent, FooterComponent, HeaderComponent, HeaderDetailsComponent, SidebarComponent, AnalyticsComponent, AddAnalyticsPopupComponent, AnalyticsEditorComponent, AddReportDetailsPopupComponent, PageTitleComponent, AnalyticsDetailsFoldDivComponent, AddAnalyticsDetailsDescriptionPopupComponent, AddCompanyPopupComponent, CompaniesComponent],
  imports: [
    CommonModule ,AdminRoutingModule , ReactiveFormsModule , FormsModule ,NgSelectModule ,NgxSmartModalModule.forChild() ,MatSortModule ,NgxSliderModule,
    AngularMyDatePickerModule ,CKEditorModule ,SharedModule
  ]
})
export class AdminModule { }
