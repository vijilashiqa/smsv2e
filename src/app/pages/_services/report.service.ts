import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {
  }
  async searchgetboxandvc(params) {
    return await this.http.post("/reports/searchgetboxandvc", params).toPromise();
  }
  async searchgetbox(params) {
    return await this.http.post("/reports/searchgetbox", params).toPromise();
  }


}
