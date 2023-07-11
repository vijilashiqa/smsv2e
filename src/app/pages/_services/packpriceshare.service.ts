import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackpriceshareService {

  constructor(private http: HttpClient) { }


  
async packpriceshare(params){

  return await this.http.post("/packpriceshare/addpackpriceshare",params).toPromise();
  }
}
