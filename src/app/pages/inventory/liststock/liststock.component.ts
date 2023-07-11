import { Component, OnInit } from '@angular/core';
import { BroadcasterService, PagerService, RoleservicesService, VendorService } from '../../_services';
import { StockService } from '../../_services/stock.service';


@Component({
  selector: 'ngx-liststock',
  templateUrl: './liststock.component.html',
  styleUrls: ['./liststock.component.scss']
})
export class ListstockComponent implements OnInit {
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;liststock;data;count;listmat;getitem;
  show;loading=false;
  constructor(
   // private broadcaster: BroadcasterService,
   public role: RoleservicesService,
    private pageservice :PagerService,
   // private vendor :VendorService,
    private stock :StockService
  ) { }

 async ngOnInit() {
  await this.initiallist();
  }

  async initiallist() {
    this.loading=true;
    this.liststock = await this.stock.liststock({index:(this.page - 1) * this.limit,limit:this.limit});
    console.log('list stock *********************', this.liststock)
    this.data = this.liststock[0];
    this.count = this.liststock[1].count;
    this.loading=false;
    this.setPage();

  }
  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    };
  }


 async materialdetails(item,index){
  this.show = index == this.show ? -1 : index;
  console.log("show the list",this.show)
   if (this.show == -1)
  return;
  this.listmat = await this.stock.listmaterial({stockinid:item})
  this.getitem=this.listmat[0];
  console.log('get item ',this.getitem)
  }



  setPage() {
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }
  
}

