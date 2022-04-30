import { IAngularMyDpOptions, IMySingleDateModel, IMyDate, IMyDateModel } from "angular-mydatepicker";
import { Injectable } from '@angular/core';

@Injectable()
export class AngularMyDatePickerOptions{
    today: IMyDate = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
    } as IMyDate;

    get options(): IAngularMyDpOptions {
        return {
            dateFormat: 'mm/dd/yyyy',
            markCurrentDay: true,
        } as IAngularMyDpOptions;
    }

    FormatDateToNgxDate(value) {
        if (value != null) {
            value = new Date(value);
            var obj: IMyDateModel  = {
                isRange:false,
                singleDate:{
                    date: {
                    
                        year: value.getFullYear(),
                        month: value.getMonth() + 1,
                        day: value.getDate()
                    },
                    jsDate:  value,
                    formatted: `${value.getMonth() + 1}/${value.getDate()}/${value.getFullYear()}`,
                    epoc: 111
                }
            } ;
            return obj;
        }
    }
}