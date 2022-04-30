export interface AnalyticsEditorFormInterface {
    documentName,
    companyId,
    analyticsTypeId,
    skip: number;
    take: number;
    count: number;
    orderBy;
    isSelectAll:boolean;
    isPublish:boolean;
    isPromote:boolean;
    analyst:string;
}