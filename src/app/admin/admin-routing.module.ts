import { EditorGuard } from './../shared/guards/editor.guard';
import { ClientGuard } from './../shared/guards/client.guard';
import { AuthGuard } from './../shared/guards/auth.guard';
import { AnalyticsEditorComponent } from './views/analytics-editor/analytics-editor.component';
import { AdminComponent } from './admin.component';
import { AnalyticsComponent } from './views/analytics/analytics.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './views/companies/companies.component';

const routes: Routes = [
    {
        path:'',
        redirectTo:"login",
        pathMatch:"full"
    },
    {
        path:'settings',
        redirectTo:"/admin/settings/companies",
        pathMatch:"full"
    },
    {
        path:'',
        component:AdminComponent ,
        canActivateChild:[AuthGuard],
        children:[
            {
                path:'landing-page',
                component:AnalyticsComponent,
                canActivate:[ClientGuard],
                data: {
                    pageTitle: 'Landing Page',
                    hideCompanyFilter: false
                }
            },
            {
                path:'analytics-editor',
                component:AnalyticsEditorComponent,
                canActivate:[EditorGuard],
                data: {
                    pageTitle: 'Analytics Editor',
                    hideCompanyFilter: false
                }
            },
            {
                path:'settings',
                children: [
                    {
                        path:'companies',
                        component:CompaniesComponent,
                        canActivate:[EditorGuard],
                        data: {
                            pageTitle: 'Companies',
                            hideCompanyFilter: false
                        }
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdminRoutingModule { }