import { Component, OnInit } from '@angular/core';
import * as JSXLSX from 'xlsx';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadendService, PackageService, PagerService } from '../../_services';
import { StbmanagementService } from '../../_services/stbmanagement.service';
import { NgForm } from '@angular/forms';
import { SubscriberService } from '../../_services/subscriber.service';
import { Router } from '@angular/router';
import { OperatorService } from '../../_services/operator.service';
import { StockService } from '../../_services/stock.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'ngx-surrender',
  templateUrl: './surrender.component.html',
  styleUrls: ['./surrender.component.scss']
})
export class SurrenderComponent implements OnInit {

  public primaryColour = '#dd0031';
  public secondaryColour = '#006ddd';
  // public loading = false;
  data; count = 0; search: boolean = false; model: any = []; head: any = [];
  pager: any = {}; page: number = 1; opt: any = []; stbdet: any = [];
  pagedItems: any = []; locitem: any = []; branchitem: any = [];boxvc_data =[]
  vcdet: any = []; Custform; limit: number = 25; headend = '';getpackagelist;
  profileid = ''; loc = ''; branch = ''; op_type = ''; listhead;custid;ufirst
  model_opt = ''; stbopt = ''; vc = ''; status = ''; to_cdate = '';loading=false;
  from_date = ''; to_date = ''; head_opt = ''; address = ''; operatortypelist;
  pack: any = []; pack_type = ''; package = ''; from_cdate = ''; listvc; pair_status
  cas: any = []; castype = ''; listsubscriberl; getmodellist; getcas; listboxpair


  constructor(
    public pageservice: PagerService,
    private operator: OperatorService,
    private headends: HeadendService,
    private subscriber: SubscriberService,
    private router: Router,
    private stock: StockService,
    private stb: StbmanagementService,
    private packageser : PackageService

  ) { }


  ngOnInit() {
    this.initiallist();
    this.createForm();
    this.getHeadend();
    this.getModel();
    this.GetCas();
    
    // this.vcparing();
  // this.boxparing();
    // this.getpackage();
  }
  async initiallist() {
  this.loading=true;
    this.listsubscriberl = await this.subscriber.listsurrender({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      user_type: this.op_type,
      userid: this.profileid,
      model: this.model_opt,
      boxno: this.stbopt,
      vc: this.vc,
      status: this.status,
      cby: this.from_date,
      end_date: this.to_date,
      hdid: this.headend,
      pack_type: this.pack_type,
      package: this.package,
      cas: this.castype,
    });
    console.log('list subscriber=====', this.listsubscriberl)
    this.data = this.listsubscriberl[0];
    this.count = this.listsubscriberl[1].count;
    this.loading=false;
    this.setPage();

  }

async getpackage(){
 this.getpackagelist = await this.packageser.searchpack({  hdid: this.headend  , packtype :this.pack_type})
 console.log("get package ",this.getpackagelist)
}

  async boxparing() {
    this.listboxpair = await this.stb.getboxpair({ hdid: this.headend })
    console.log('listboxpair', this.listboxpair)
  }

  async vcparing() {
    let boxno = this.stbopt;
    console.log('listboxpair in funxction', this.listboxpair)
     this.boxvc_data = this.listboxpair?.filter(x => x.boxid == boxno)
    console.log('stbno in aarray', boxno)
    console.log('vcid here', this.boxvc_data);
    this.pair_status = this.boxvc_data[0].pairflg;
    console.log("pair status @@@@@",this.pair_status)
    this.listvc = [];
    if (this.boxvc_data[0].vcid) {
      console.log("boxdata@@@@@@@@", this.boxvc_data[0].vcid)
      this.listvc = [{ vcid: this.boxvc_data[0].vcid, vcno: this.boxvc_data[0].vcno }]
      console.log('listvc**********', this.listvc)
    } else {
      const data = []
      let vclist = this.listboxpair.filter(x => x.vcno !== 0 && x.vcno !== null).reduce((a, v) => {
        const value = { vcid: v.vcid, vcno: v.vcno }
        data.push(value)
        return data
       
      }, [])
      console.log("data",data)
      this.listvc = vclist
      console.log('vclist', vclist);
    }
  }


  async GetCas($event = '') {
    this.getcas = await this.headends.getcas({ like: $event })
    console.log(this.getcas)
  }


  view(item) {
    localStorage.setItem('cust_data', JSON.stringify(item));
    console.log("daatahere", JSON.stringify(item))
    this.router.navigate(["/pages/customer/view-cust"])
  }

  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    };
  }

  async getoperator() {
    this.operatortypelist = await this.operator.searchoperator({ usertype: this.op_type, hdid: this.headend })
    console.log('list operator', this.operatortypelist)
  }


  async getHeadend() {
    console.log('event', event)
    this.listhead = await this.headends.getHeadend({})
    console.log(this.listhead)
  }
 
  async getModel() {
    this.getmodellist = await this.stock.getstockmodel({});
  }
  setPage() {
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }
  createForm() {
    this.Custform = new FormGroup({
      subname_check: new FormControl(true),
      optname_check: new FormControl(true),
      custid_check: new FormControl(true),
      caf_check: new FormControl(true),
      status_check: new FormControl(true),
      cas_check: new FormControl(true),
      stb_check: new FormControl(true),
      vc_check: new FormControl(true),
      loc_check: new FormControl(),
      mob_check: new FormControl(true),
      act_check: new FormControl(true),
      exp_check: new FormControl(true),
      addr_check: new FormControl(true),
      headend : new FormControl(true)
    });
  }


  async Download() {
    this.listsubscriberl = await this.subscriber.listsubscriber(
      {
        user_type: this.op_type,
        userid: this.profileid,
        model: this.model_opt,
        boxno: this.stbopt,
        vc: this.vc,
        status: this.status,
        cby: this.from_date,
        end_date: this.to_date,
        hdid: this.headend,
        pack_type: this.pack_type,
        package: this.package,
        cas: this.castype,
      }
    )
    this.data = this.listsubscriberl[0];
         console.log("result in console",this.data)
        if ( this.data) {
          let tempdata = [], temp: any =  this.data;
          for (var i = 0; i < temp.length; i++) {
            let parm = {};
            if (this.Custform.value['optname_check']) {
              parm['Operator Name'] = temp[i]['usertype'] == 444 ? 'LCO ' : temp[i]['usertype'] == 666 ? 'Distributor' :temp[i]['usertype'] == 555 ? 'Sub-Distributor' : 'Hotel'  ;
            }
            if (this.Custform.value['custid_check']) {
              parm['Customer ID'] = temp[i]['custid'];
            }
            if (this.Custform.value['subname_check']) {
              parm['Subscriber Name'] = temp[i]['fullname'] ;
            }
            if (this.Custform.value['addr_check']) {
              parm['Address'] = temp[i]['installation_addr'];
            }
            if (this.Custform.value['caf_check']) {
              parm['CAF Number'] = temp[i]['cafno'];
            }
            if (this.Custform.value['status_check']) {
              parm['Status'] = temp[i]['purchase_flg'] == 1 ? 'Active' : 'Inactive';
            }
            if (this.Custform.value['cas_check']) {
              parm['STB Type'] = temp[i]['model_name'];
            }
            if (this.Custform.value['stb_check']) {
              parm['STB Number'] = temp[i]['boxno'] + '';
            }
            if (this.Custform.value['vc_check']) {
              parm['VC Number'] = temp[i]['vc_no'] + '';

            }

            parm['Pack type'] = temp[i]['a_la_cart'] == 0 ? 'BasePack' : temp[i]['a_la_cart'] == 4 ? 'Bouquet' : 'N/A';

            parm['Pack Name '] = temp[i]['pack_name'];

            if (this.Custform.value['loc_check']) {
              parm['Location'] = temp[i]['loc_name'];
            }
            if (this.Custform.value['mob_check']) {
              parm['Mobile'] = temp[i]['mobile'] ? temp[i]['mobile'] + '' : '';
            }
            if (this.Custform.value['act_check']) {
              parm['Activate Date'] = temp[i]['active_date'] ? temp[i]['active_date'].substring(0, 10) : '';
            }
            if (this.Custform.value['exp_check']) {
              parm['Expiry Date'] = temp[i]['expiry_date'] ? temp[i]['expiry_date'].substring(0, 10) : '';
            }
            tempdata[i] = parm;
          }
          const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
          const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
          JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
          JSXLSX.writeFile(wb, 'Subscriber_report' + EXCEL_EXTENSION);
        }
 
  }


  


 


  renew(item) {
    localStorage.setItem('cust_data', JSON.stringify(item));
    this.router.navigate(['/pages/customer/renew_cust'])
  }


}
