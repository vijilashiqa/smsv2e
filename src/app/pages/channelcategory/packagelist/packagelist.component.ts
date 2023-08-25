import { Component, OnInit } from '@angular/core';
import * as JSXLSX from 'xlsx';

import { BroadcasterService, HeadendService, PackageService, PagerService, RoleservicesService } from '../../_services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackagechannelComponent } from '../packagechannel/packagechannel.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'ngx-packagelist',
  templateUrl: './packagelist.component.html',
  styleUrls: ['./packagelist.component.scss']
})
export class PackagelistComponent implements OnInit {
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25; listpackage; data; count;
  headend = ''; op_type = ''; opt: any = []; listhead; broadcast; loading = false;
  share: any = []; operator_name = '';
  pack_type = ''; pack: any = []; package = ''; getpackagelist
  index = -1; cas: any = []; cas_type = ''; prod_id = '';
  broadlist: any = []; bcid = ''; modalRef: BsModalRef;
  constructor(private packageser: PackageService,
    private pageservice: PagerService,
    private modal: NgbModal,
    public role: RoleservicesService,
    private broadcasterService: BroadcasterService,
    private headends: HeadendService) { }

  ngOnInit() {
    this.initiallist();
    if (this.role.getroleid() > 777) {
      this.getHeadend();

    } else {
      this.headend = JSON.parse(localStorage.getItem('userinfo'))['hdid'];
      this.Getbroadcasteredit();
    }
  }

  async Getbroadcasteredit($event = '') {
    this.broadcast = await this.broadcasterService.getbroadcaster({ hdid: this.headend });
  }

  async initiallist() {
    this.loading = true;
    this.listpackage = await this.packageser.listpackage({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      hdid: this.headend,
      packtype: this.pack_type,
      packid: this.package,
      bcid: this.bcid,
    });
    console.log("package list",this.listpackage)
    this.data = this.listpackage[0];
    this.count = this.listpackage[1].cnt;
    this.loading = false;
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



  async getpackage() {
    this.getpackagelist = await this.packageser.searchpack({ hdid: this.headend, packtype: this.pack_type })
  }

  channels(item) {
    const modalRef = this.modal.open(PackagechannelComponent, { size: 'sm', container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.modalHeader = 'Channel List';
    modalRef.componentInstance.item = item;
    modalRef.result.then((data) => {
      ;

    })

  }
  async getHeadend() {
    this.listhead = await this.headends.getHeadend({})
    console.log(this.listhead)
  }


  ClearHeadend(){
    this.pack_type= '';
    this.package='';
    this.bcid='';
  }


  ClearPacktype(){
    this.package='';
    this.bcid='';
  }

  ClearBroadcaster(){
    this.bcid='';
  }
  async Download() {
    this.listpackage = await this.packageser.listpackage({
      hdid: this.headend,
      packtype: this.pack_type,
      packid: this.package,
      bcid: this.bcid,
    });
    this.data = this.listpackage[0]
    if (this.data) {
      let tempdata = [], temp: any = this.data;
      for (var i = 0; i < temp.length; i++) {
        let parm = {};
        parm['Package ID '] = temp[i]['packid'];
        parm['Package Type'] = temp[i]['packtype'] == 0 ? 'BasePackage' : temp[i]['packtype'] == 1 ? 'ALaCarte' : temp[i]['packtype'] == 2 ? 'AddOn Pack'
          : temp[i]['packtype'] == 3 ? 'Bundle ' : 'N/A';
        parm['Package Name'] = temp[i]['packname'];
        parm['Channels'] = temp[i]['channame'];
        parm['Service Type '] = temp[i]['srvtype'] == 0 ? 'Prepaid' : 'Postpaid';
        parm['TAX Enable'] = temp[i]['enable_tax'] == 1 ? 'Yes' : 'No';
        parm['TAX Type'] = temp[i]['tax_type'] == 0 ? 'Include' : 'Exclude';
        tempdata[i] = parm;
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Package_List' + EXCEL_EXTENSION);
    }
  }


}
