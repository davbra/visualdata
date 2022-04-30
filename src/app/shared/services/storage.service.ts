import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private _AngularFireStorage: AngularFireStorage) { }

  upload(file: File, path) {
    const fileRef = this._AngularFireStorage.ref(path);
    const task = this._AngularFireStorage.upload(path, file);

    return new Observable(obs => {
      return  task.snapshotChanges().pipe(finalize(() =>{
        fileRef.getDownloadURL().subscribe(url => {
          obs.next(url);
          obs.complete();
        });
      })).subscribe()
    });
  }

  delete(path) {
    return this._AngularFireStorage.storage.refFromURL(path).delete();
  }
}
