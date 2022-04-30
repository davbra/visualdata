import { AngularMyDatePickerOptions } from './shared/settings/angular-mydatepicker-options';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgStackFormsModule } from '@ng-stack/forms';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule } from 'ng6-toastr-notifications';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { CKEditorModule } from 'ckeditor4-angular';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, AppRoutingModule, ReactiveFormsModule, FormsModule, BrowserAnimationsModule, NgSelectModule, HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), AngularFireDatabaseModule, AngularFireStorageModule,
    NgxSmartModalModule.forRoot(), NgStackFormsModule, MatSortModule, ToastrModule.forRoot(), NgxSliderModule, AngularMyDatePickerModule ,CKEditorModule
  ],
  providers: [AngularMyDatePickerOptions],
  bootstrap: [AppComponent]
})
export class AppModule { }
