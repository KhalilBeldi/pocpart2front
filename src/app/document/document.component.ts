import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import { AlfrescoService } from '../alfresco.service';
import { docInfo } from '../docInfo';
import { UploadFileService } from '../upload-file.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.css']
})
export class DocumentComponent implements OnInit {

  documents :docInfo[] = [];
  //documentid: string;

  alf_ticket: string;

  
  selectedFiles?: FileList;

  currentFile?: File;

  progress = 0;

  message = '';

  fileInfos?: Observable<any>;


  constructor(private alfrescoService:AlfrescoService,private uploadService:UploadFileService) { }

  ngOnInit(): void {

    this.fileInfos = this.uploadService.getFiles();

    this.alfrescoService.Authenticate('admin','admin').subscribe(res => {
      this.alf_ticket = res.entry.id;
    })

    this.documentList();

  }

  documentList(){

    this.alfrescoService.getSiteDocuments().subscribe((data : docInfo[]) => {
    
      this.documents = data;
      
    });

  }

  downloadFile(docid:string){
    this.alfrescoService.downloadFile(this.alf_ticket,docid).subscribe(data => {
      console.log(this.alf_ticket);
      FileSaver.saveAs(data.url);
    })
  }

  selectFile(event:any) {
    this.selectedFiles = event.target.files;
  }


  
  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.uploadService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }

      this.selectedFiles = undefined;
    }
  }

}
