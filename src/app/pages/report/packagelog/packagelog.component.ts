import { Component, OnInit } from '@angular/core';
import { BroadcasterService, HeadendService, PackageService, PagerService, RoleservicesService } from '../../_services';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
// import { PacklogService } from '../../_services/packlog.service';
import { PackageremarkComponent } from '../packageremark/packageremark.component';

@Component({
  selector: 'ngx-packagelog',
  templateUrl: './packagelog.component.html',
  styleUrls: ['./packagelog.component.scss']
})
export class PackagelogComponent implements OnInit {
  data; 
  pager: any = {}; tot: any = [];
  pagedItems: any = [];
  page: number = 1; head: any = [];
  search: boolean; opt: any = [];
  DepositForm; head_opt = '';
  limit: number = 25;
  order: any = []; headend: any = '';
  operator_name = ''; status = '';
  from_date; to_date
  deposit_type = ''; paymode = '';
  order_id; amt; op_type = '';
  loading=false;
  broadcaster = ''; broadlist: any = []; genre = ''; listgener; lang; channelForm;count; listdeposit; listhead; headendl; selectchannel
  channel_name = ''; submit: boolean; lcn_num = ''; language = ''; broadcast
  channel_type = '';
  channel_mode = '';
  logmsg;
  number = 1; listpackage;
  share: any = [];
  pack_type = ''; pack: any = []; package = ''; getpackagelist;
  index = -1; cas: any = []; cas_type = ''; prod_id = '';
  bcid = ''; modalRef: BsModalRef;
 
  BsModalRef;
  packlog;
  log_msg = '';
  Getbroadcaster: any;
  getbrodcasterlist: Object;
  servicetype: Object;
  servtype: Object;

  constructor(
    private packageser: PackageService,
    // private deposit :PacklogService,
    private pageservice: PagerService,
    private modal: NgbModal,
    public role: RoleservicesService,
    private broadcasterService: BroadcasterService,
    private headends: HeadendService) { }

    async ngOnInit() {
      this.initiallist();
      
      if (this.role.getroleid() > 777) {
        this.getHeadend();
        } else {
        this.headend = JSON.parse(localStorage.getItem('userinfo'))['hdid'];
       this.Getbroadcasteredit();
      //  this.Getservicetype();
      }
       }

    async initiallist() {
      this.loading=true;
      this.listpackage = await this.packageser.listpackage({
      index:(this.page - 1) * this.limit,
      limit:this.limit,
      hdid: this.headend,
      logmsg:this.log_msg,
      packtype: this.pack_type,
      packid: this.package,
      bcid: this.bcid,
      stype: this.servicetype,
      
    });
    
      console.log('list deposit=====', this.listpackage)
      this.data = this.listpackage[0];
      console.log('result',this.data)
      this.count = this.listpackage[1].count;
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

//     packages(item) {
//       const modalRef = this.modal.open(PackageremarkComponent, { size: 'sm', container: 'nb-layout', backdrop: false });
//       modalRef.componentInstance.modalHeader = 'Remarks';
//       modalRef.componentInstance.item = item;
//       modalRef.result.then((data) => {
//         ;
//  })
//       }
    async getHeadend() {
      this.listhead = await this.headends.getHeadend({})
      console.log(this.listhead)
    }
    
    async getpackage() {
      this.getpackagelist = await this.packageser.searchpack({ hdid: this.headend, packtype: this.pack_type })
    }

    async Getbroadcasteredit($event = '') {
      this.broadcast = await this.broadcasterService.getbroadcaster({ hdid: this.headend });
    }
    // async Getservicetype($event = '') {
    //   this.servtype = await this.packageser.listpackage({ hdid: this.headend, bcid: this.bcid });
    // }
    // async Download() {
    //   this.listpackage = await this.packageser.listpackage({
    //     hdid: this.headend,
    //    logmsg: this.log_msg,
    //     packid: this.package,
    //     bcid: this.bcid,
    //     stype: this.servicetype,
    //   });
    //   this.data = this.listpackage[0]
    //   if (this.data) {
    //     let tempdata = [], temp: any = this.data;
    //     for (var i = 0; i < temp.length; i++) {
    //       let parm = {};
         
    //       parm['Package Type'] = temp[i]['logmsg'] == 1 ? 'Bundle ' : 'N/A';
    //               tempdata[i] = parm;
    //     }
    //   }
    // }  
  }
  