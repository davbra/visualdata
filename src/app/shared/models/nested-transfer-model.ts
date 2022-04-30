export class NestedTransferModel<T = any> {
    public data: T;
    public isNew: boolean;
    constructor(data, isnew) {
        this.data = data;
        this.isNew = isnew;
    }
}