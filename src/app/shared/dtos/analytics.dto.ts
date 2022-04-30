import { AnalyticsDetailDto } from './analytics-detail.dto';
import { AnalyticsTypeDto } from './analytics-type.dto';
import { CompanyDto } from './company.dto';
export class AnalyticsDto{
    id?;
    flag;
    primaryCompanyArr:CompanyDto[];
    secondaryCompanyArr:CompanyDto[];
    documentName:string;
    expertCount;
    length;
    analyticsType:AnalyticsTypeDto;
    date;
    updatedDate;
    publish?;
    promote?;
    isShowDetails?;
    isSelected?;
    analyticsDetailArr?:AnalyticsDetailDto[] = [];
    analyst:string;
    reportDate:Date;
    description;
}