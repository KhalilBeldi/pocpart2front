import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { alfrescoRes } from './alfrescoRes';
import { docInfo } from './docInfo';

const AUTH_API = 'http://localhost:8080/alfresco/api/-default-/public/authentication/versions/1/tickets';
const API_SERVICE = 'http://localhost:8081/api/';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AlfrescoService {

  constructor(private http: HttpClient) { }

  Authenticate(userId: string,pwd: string):Observable<alfrescoRes>{

    return this.http.post<alfrescoRes>(AUTH_API,{
      userId: userId,
      password: pwd,
    }, httpOptions);
  }

  getSiteDocuments(): Observable<docInfo[]> {
    return this.http.get<docInfo[]>(`${API_SERVICE}documents`);
  }

  downloadFile(ticket:string,docid: string){

    const BASE_URL = `http://localhost:8080/alfresco/s/slingshot/node/content/workspace/SpacesStore/${docid}?a=true&alf_ticket=`;
    
    const REQ_URL = BASE_URL + ticket;

    return this.http.get(REQ_URL,{observe: 'response', responseType: 'blob'}
    );

  }  

}
