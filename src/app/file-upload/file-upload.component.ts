import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFireStorage } from 'angularfire2/storage';
import { Component } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
;

@Component({
  selector: 'file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  // Progress monitoring
  percentage: Observable<number>;

  snapshot: Observable<any>;
    // State for dropzone CSS toggling
    isHovering: boolean;
  constructor(private storage: AngularFireStorage, private db: AngularFirestore) { }
  toggleHover(event: boolean) {
    this.isHovering = event;
  }
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'https://us-central1-upload-images-ca015.cloudfunctions.net/addImage';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') { 
      console.error('unsupported file type :( ')
      return;
    }

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
     )
    .subscribe()
  }
  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes
  }

}