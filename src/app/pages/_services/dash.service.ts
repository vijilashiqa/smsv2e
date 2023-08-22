import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashService {
  constructor(private http: HttpClient) { }
  
  async search(params) {
    return await this.http.post("/dashboard/search", params).toPromise();
  }

}
