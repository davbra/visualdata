import { DownloadFileModel } from './../models/download-file.model';
import { AnalyticsFileDto } from './../dtos/analytics-file.dto';
import { AnalyticsFileModel } from './../models/analytics-file.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { defer, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsFileService {
  private collectionName = 'analytics-files';

  constructor(private _AngularFirestore: AngularFirestore, private _HttpClient: HttpClient) {
  }

  getArr(analyticsId): Observable<AnalyticsFileDto[]> {
    return this._AngularFirestore.collection(this.collectionName, ref => {
      return ref.where('analyticsId', '==', analyticsId).orderBy('createdDate');
    }).get().pipe(take(1)).pipe(map(x => {
      return x.docs.map(e => {
        return {
          id: e.id,
          ...e.data() as any
        } as AnalyticsFileModel;
      })
    })).pipe(map((arr => {
      var dtoArr: AnalyticsFileDto[] = [];
      arr.forEach(item => {
        var dto: AnalyticsFileDto = {
          id: item.id,
          name: item.name,
          url: item.url,
          createdDate: item.createdDate,
          analyticsId: item.analyticsId
        }
        dtoArr.push(dto);
      });
      return dtoArr;
    })));
  }

  create(model: AnalyticsFileModel): Observable<string> {
    delete model.id;
    delete model.file;
    return defer(() => {
      return this._AngularFirestore.collection(this.collectionName).add(model).then(result => {
        return result.id;
      })
    });
  }

  delete(id) {
    return defer(() => {
      return this._AngularFirestore.doc(`${this.collectionName}/${id}`).delete().then(result => {
        return result;
      })
    });
  }


  downloadFile(name: string, url) {
    return this._HttpClient.get(url, { responseType: "blob" }).pipe(map((res: any) => {
      const data: Blob = new Blob([res]);
      FileSaver.saveAs(data, name);
    }));
  }

  downloadAllFile(fileArr: DownloadFileModel[],documentName:string) {
    var zip = new JSZip();
    fileArr.forEach((file , index) => {
      this._HttpClient.get(file.url, { responseType: "blob" }).pipe(map((res: any) => {
        const data: Blob = new Blob([res]);
        return data;  
      })).subscribe(data=>{
        zip.file(file.name, data);
        if(index != (fileArr.length - 1)){
          zip.generateAsync({ type: "blob" }).then(function (content) {
            FileSaver.saveAs(content, `${documentName}.zip`);
          });
        }
      });
    });
  
  }
}
