export class AnalyticsEditorTopicInfoModel{
    companyArr : AnalyticsEditorTopicInfoCompanyModel[];
    count :number;
}

class AnalyticsEditorTopicInfoCompanyModel{
    id;
    name;
    isPrimary:boolean;
}