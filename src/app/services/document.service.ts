import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, firstValueFrom, lastValueFrom, map, throwError } from "rxjs";
import { catchError, delay, tap } from "rxjs/operators";

import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

const AUTH_API_V1 = `${environment.api_base_url}`;

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  error: any;
  errorCodes: Array<any> = [
    400,
    401,
    402,
    403,
    404,
    405,
    406,
    422,
    500,
    501
  ];

  apiUrl: string = `${AUTH_API_V1}/documents`;

  constructor(
    private http: HttpClient
  ) { }

  public getDocuments(): Observable<any[]> {
    const data = this.http.get(this.apiUrl).pipe(
      map((response: any) => response.data)
    );
    return data;
  }

  public updateDocument(id:any, formData:FormData): Observable<any> {
    const url = this.apiUrl.concat(`/${id}`);
    
    const apiResponse = this.http.put(url, formData).pipe(
      catchError(err => {
        console.log("update service error",err);
        return this.handleError(err);
      })
    );
    return apiResponse;
  }

  public deleteDocument(id: any): Observable<any> {
    const url = this.apiUrl.concat(`/${id}`);

    const data = this.http.delete(url).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
    return data;
  }

  public createDocument(formData: FormData): Observable<any> {
    const apiResponse = this.http.post(this.apiUrl, formData).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
    return apiResponse;
  }

  public getDocumentById(id: any): Observable<any> {
    const url = this.apiUrl.concat(`/${id}`);

    const apiResponse = this.http.get<any>(url).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
    return apiResponse;
  }

  public relevanceStats(): Observable<any> {
    const url = this.apiUrl.concat(`/stats/relevance`);
    
    const apiResponse = this.http.get(url).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
    return apiResponse;
  }

  public monthlyStats(): Observable<any> {
    const url = this.apiUrl.concat(`/stats/monthly-approvals`);
    
    const apiResponse = this.http.get(url).pipe(
      catchError(err => {
        return this.handleError(err);
      })
    );
    return apiResponse;
  }

  private handleError(err: any) {
    if(this.errorCodes.includes(err.status)) {
      this.error = {...err.error };
      this.error.code = err.status;
    }
    return throwError(() => this.error);
  }
}
