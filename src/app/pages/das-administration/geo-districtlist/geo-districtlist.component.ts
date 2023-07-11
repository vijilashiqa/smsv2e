import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CountryService, PagerService } from '../../_services';
import { GeoAdddistrictComponent } from '../geo-adddistrict/geo-adddistrict.component';
@Component({
  selector: 'ngx-geo-districtlist',
  templateUrl: './geo-districtlist.component.html',
  styleUrls: ['./geo-districtlist.component.scss']
})
export class GeoDistrictlistComponent implements OnInit {
  
   pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;getlistdect;data;count;
  listcountryf;liststatef;
  modalRef: BsModalRef;loading=false  
  modalOptions: NgbModalOptions;

  constructor(
    private dialogService: NbDialogService,
    public pageservice: PagerService,
    private country : CountryService,
    private modal: NgbModal,) { }

  ngOnInit(): void {
    this.initiallist();

  } 
  async initiallist() {
    this.loading=true;
    this.getlistdect = await this.country.listdictgeo({index:(this.page - 1) * this.limit,limit:this.limit});
    console.log('district list############=====', this.getlistdect)
    this.data = this.getlistdect[0];
    this.count = this.getlistdect[1].count;
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


  
  AddDistrict()     {
   
    const modalRef = this.modal.open(GeoAdddistrictComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Add District';
    modalRef.result.then((data) => {
      this.initiallist();
    })
}

  EditDistrict(item) {
    const modalRef = this.modal.open(GeoAdddistrictComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Edit District';
    modalRef.componentInstance.item = item
    modalRef.result.then((data) => {
      this.initiallist();
    })
    }


    
  }


