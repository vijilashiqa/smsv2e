import { Component, OnInit } from '@angular/core';
import { PagerService, RoleservicesService, VendorService } from '../../_services';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AddvendorComponent } from '../addvendor/Addvendor.component';
@Component({
  selector: 'ngx-makelist',
  templateUrl: './vendorlist.component.html',
  styleUrls: ['./vendorlist.component.scss']
})
export class VendorlistComponent implements OnInit {
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25; getvendorlist; data; count;
  modalOptions: NgbModalOptions;loading=false;

 constructor(
    public pageservice: PagerService,
   private modal: NgbModal,
   public role: RoleservicesService,
   private venodor :VendorService
 ) { }

 ngOnInit(): void {
   this.initiallist();
 }

 async initiallist() {
  this.loading=true;
   this.getvendorlist = await this.venodor.listvendor({ index: (this.page - 1) * this.limit, limit: this.limit });
   console.log('vendor=====', this.getvendorlist)
   this.data = this.getvendorlist[0];
   this.count = this.getvendorlist[1].count;
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

 setPage() {
   this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
   this.pagedItems = this.data;
 }


 Addmake() {
   const modalRef = this.modal.open(AddvendorComponent, { container: 'nb-layout', backdrop: false });
   modalRef.componentInstance.title = 'Add Vendor';
   modalRef.result.then((data) => {
     this.initiallist();
   })
 };

 Editmake(item) {
  console.log('item data',item)
   const modalRef = this.modal.open(AddvendorComponent, { container: 'nb-layout', backdrop: false });
   modalRef.componentInstance.title = 'Edit Vendor';
   modalRef.componentInstance.item = item
   modalRef.result.then((data) => {
     this.initiallist();
   })
 }
}
