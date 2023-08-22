import { Component, OnInit } from '@angular/core';
import { CountryService, HeadendService, PagerService, RoleservicesService, VendorService } from '../../_services';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { OperatorService } from '../../_services/operator.service';
import { StockService } from '../../_services/stock.service';
import { StbparingComponent } from '../../stbmanagement/stbparing/stbparing.component';
import { StbmanagementService } from '../../_services/stbmanagement.service';


@Component({
  selector: 'ngx-stbreport',
  templateUrl: './stbreport.component.html',
  styleUrls: ['./stbreport.component.scss']
})
export class StbreportComponent implements OnInit {
  stbform; roleVal: any = []; search: boolean = false;
  pager: any = {}; page: number = 1; act_check = true; exp_check = true;
  pagedItems: any = []; head: any = []; loc: any = []; opt: any = [];
  operator_name; locitem: any = []; branchitem: any = [];
  vcdet: any = []; stbdet: any = []; model: any = []; limit = 25; operatortypelist
  pair = ''; assign = ''; getmodellist;
  cas = ''; stbopt = ''; status = ''; profileid = ''; listhead; op_type = '';
  from_date = ''; to_date = ''; headend = ''; modelname = ''; vc = '';
  status_check = true; cas_check = true; stb_check = true; vc_check = true; id_check = true;
  data; count; listboxpair; listvc; pair_status; pairflg;gethdcas;
  modalRef: BsModalRef;
  loading = false;
  searchgetboxpair;
  liststb;
 

  constructor(
    private stb: StbmanagementService,
    public pageservice: PagerService,
     private modal: NgbModal,
    private stock: StockService,
    private headends: HeadendService,
    private operator: OperatorService,
    public role: RoleservicesService,
  ) { }

  async ngOnInit() {
    await this.initiallist();
    if (this.role.getroleid() > 777) {
      await this.getHeadend();
    } else {
      this.headend = JSON.parse(localStorage.getItem('userinfo'))['hdid'];
      await this.getModel();
    }
  }

  async initiallist() {
  this.loading = true;
    this.liststb = await this.stb.liststb({
      boxid: this.stbopt,
      usertype: this.op_type,
      vcid: this.vc,
      hdid: this.headend,
      pairflg: this.pair,
      assign: this.assign
    });
    console.log('list stb=====', this.liststb)
    this.data = this.liststb[0];
    this.count = this.liststb[1].count;
    this.loading = false;
    this.setPage();
  }


  async getHeadend($event = '') {
    // console.log('event',event)
    this.listhead = await this.headends.getHeadend({})
    console.log(this.listhead)
  }


  async boxparing() {
    this.listboxpair = await this.stb.searchgetboxpair({ hdid: this.headend })
    console.log('listboxpair', this.listboxpair)
  }


  async vcparing() {
    let boxno = this.stbopt;
    console.log('listboxpair in function', this.listboxpair)
    const boxvc_data = this.listboxpair?.filter(x => x.boxid == boxno)
    console.log('stbno in aarray', boxno)
    console.log('vcid here', boxvc_data);
    this.pair_status = boxvc_data[0].pairflg;
    console.log("pair status @@@@@", this.pair_status)
    this.listvc = [];
    if (boxvc_data[0].vcid) {
      console.log("boxdata@@@@@@@@", boxvc_data[0].vcid)
      this.listvc = [{ vcid: boxvc_data[0].vcid, vcno: boxvc_data[0].vcno }]
      console.log('listvc**********', this.listvc)
    } else {
      const data = []
      let vclist = this.listboxpair.filter(x => x.vcno !== 0 && x.vcno !== null)
      console.log('empty list', vclist)
      vclist.reduce((a, v) => {
        const value = { vcid: v.vcid, vcno: v.vcno }
        data.push(value)
        return data

      }, [])
      console.log("data", data)
      this.listvc = vclist
      console.log('vclist', vclist);
    }
  }


  async getoperator() {
    this.operatortypelist = await this.operator.searchoperator({ usertype: this.op_type, hdid: this.headend })
    console.log('list operator', this.operatortypelist)
  }


  async getModel() {
    this.getmodellist = await this.stock.getstockmodel({});
    console.log('stb list', this.getmodellist)
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

  addpair() {
    const modalRef = this.modal.open(StbparingComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Paring/Unparing';
    modalRef.result.then((data) => {
      this.initiallist();
    })

  }
}