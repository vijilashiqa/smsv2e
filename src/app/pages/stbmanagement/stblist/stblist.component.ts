import { Component, OnInit } from '@angular/core';
import { CountryService, HeadendService, PagerService, RoleservicesService, VendorService } from '../../_services';
import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { StbmanagementService } from '../../_services/stbmanagement.service';
import { StbparingComponent } from '../stbparing/stbparing.component';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { OperatorService } from '../../_services/operator.service';
import { StockService } from '../../_services/stock.service';
import { ReportService } from '../../_services/report.service';

@Component({
  selector: 'ngx-stblist',
  templateUrl: './stblist.component.html',
  styleUrls: ['./stblist.component.scss']
})
export class StblistComponent implements OnInit {
  stbform; roleVal: any = []; search: boolean = false;
  pager: any = {}; page: number = 1; act_check = true; exp_check = true;
  pagedItems: any = []; head: any = []; loc: any = []; opt: any = [];
  operator_name; locitem: any = []; branchitem: any = [];
  vcdet: any = []; stbdet: any = []; model: any = []; limit = 25; operatortypelist
  pair = ''; assign = ''; getmodellist;
  cas = ''; stbopt = ''; status = ''; profileid = ''; listhead; op_type = '';
  from_date = ''; to_date = ''; headend = ''; modelname = ''; vc = '';
  status_check = true; cas_check = true; stb_check = true; vc_check = true; id_check = true;
  data; count; listboxpair; listvc; pair_status; pairflg;
  modalRef: BsModalRef;
  loading = false;

  liststb;
  constructor(
    public pageservice: PagerService,
    private stb: StbmanagementService,
    private modal: NgbModal,
    private report : ReportService,
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
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      bmid: this.modelname,
      boxid: this.stbopt,
      vcid: this.vc,
      usertype: this.op_type,
      status: this.status,
      id: this.profileid,
      cdate: this.from_date,
      mdate: this.to_date,
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
    this.listboxpair = await this.report.searchgetbox({ hdid: this.headend })
    // console.log('listboxpair', this.listboxpair)
  }

  async vcparing() {
    let boxno = this.stbopt;
    const boxvc_data = this.listboxpair?.filter(x => x.boxid == boxno)
    this.pair_status = boxvc_data[0].pairflg;
    this.listvc = [];
    if (boxvc_data[0].vcid) {
      this.listvc = [{ vcid: boxvc_data[0].vcid, vcno: boxvc_data[0].vcno }]
    } else {
      const data = []
      let vclist = this.listboxpair.filter(x => x.vcno !== 0 && x.vcno !== null)
      console.log("vc lists in the data ",vclist)
      vclist.reduce((a, v) => {
        console.log("@@@@@@@@@@@2",a)
        console.log("%%%%%%%%%%%%%%%%",v)
        const value = { vcid: v.vcid, vcno: v.vcno }
        data.push(value)
        return data

      }, [])
      this.listvc = vclist
    }
  }


  async getoperator() {
    this.operatortypelist = await this.operator.searchoperator({ usertype: this.op_type, hdid: this.headend })
    // console.log('list operator', this.operatortypelist)
  }


  async getModel() {
    this.getmodellist = await this.stock.getstockmodel({});
    // console.log('stb list', this.getmodellist)
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
