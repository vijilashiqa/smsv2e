import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private http: HttpClient) { }


  async addpackage(params) {
    return await this.http.post("/package/addpackage", params).toPromise();
  }

  async listbundlepack(params) {
    return await this.http.post("/package/getpacklist", params).toPromise()
  }

  async listpackage(params) {
    return await this.http.post("/package/packlist", params).toPromise();
  }


  async editdatapackage(params) {
    return await this.http.post("/package/getpackedit", params).toPromise();
  }

  async editpackage(params) {
    return await this.http.post("/package/packageedit", params).toPromise();
  }


  async bulkpackage(params) {
    return await this.http.post("/package/bulkpackage", params).toPromise();
  }


  async searchpack(params){

    return await this.http.post("/package/searchpack",params).toPromise();
  }



  async getproductid(params){

    return await this.http.post("/package/getproductid",params).toPromise();
  }



  async searchpackshare(params){

    return await this.http.post("/package/searchpackshare",params).toPromise();
  }
  
  async searchpackshareone(params){

    return await this.http.post("/package/searchpackshareone",params).toPromise();
  }


  async getrenewalpack(params){

    return await this.http.post("/package/getrenewalpack",params).toPromise();
  }


}
