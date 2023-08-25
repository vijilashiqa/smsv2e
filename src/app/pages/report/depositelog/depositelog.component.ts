import { Component, OnInit } from '@angular/core';
import { HeadendService, PagerService, RoleservicesService } from '../../_services';
// import { DepositelogService } from '../../_services/depositelog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockService } from '../../_services/stock.service';
import { OperatorService } from '../../_services/operator.service';
import { DepositService } from '../../_services/deposit.service';


@Component({
  selector: 'ngx-depositelog',
  templateUrl: './depositelog.component.html',
  styleUrls: ['./depositelog.component.scss']
})
export class DepositelogComponent implements OnInit {
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
  deposit_type = '';
  order_id; amt; op_type = '';
  loading=false;
  broadcaster = ''; broadlist: any = []; genre = ''; listgener; lang; channelForm;count; listdeposit; listhead; headendl; selectchannel
  channel_name = ''; submit: boolean; lcn_num = ''; language = ''; broadcast
  channel_type = ''
  channel_mode = '';


  stbform; roleVal: any = []; 
  act_check = true; exp_check = true;
   loc: any = []; 
  locitem: any = []; branchitem: any = [];
  vcdet: any = []; stbdet: any = []; model: any = [];operatortypelist
  pair = ''; assign = ''; getmodellist;
  cas = ''; stbopt = ''; profileid = ''; 
   modelname = ''; vc = '';
   depmode='';
  status_check = true; cas_check = true; stb_check = true; vc_check = true; id_check = true;
   listboxpair; listvc; pair_status; pairflg;gethdcas;
   liststb;
  pay_mode: any;deposite_mode;
  listmode;
  listpaymode;
  dep_mode_name: any;
  depositpaymode;
    

  constructor(private pageservice: PagerService,
    // private stb :DepositelogService,
    public role: RoleservicesService,
    private headends: HeadendService,
    private deposit :DepositService,
    private modal: NgbModal,
    private stock: StockService,
    private operator: OperatorService,
    ) { }

    async ngOnInit() {
      await this.initiallist();
     await this.depositemode();
    


      if (this.role.getroleid() > 777) {
        await this.getHeadend();
      } else {
        this.headend = JSON.parse(localStorage.getItem('userinfo'))['hdid'];
        await this.getModel();
      }
    }
    async initiallist() {
      this.loading=true;
      this.listdeposit = await this.deposit.listdeposit({index:(this.page - 1) * this.limit,
         hdid: this.headend,
         userid: this.profileid,
         depid:this.dep_mode_name,
         usertype: this.op_type,
         limit:this.limit });
      console.log('list deposit=====', this.listdeposit)
      this.data = this.listdeposit[0];
      this.count = this.listdeposit[1].count;
      this.loading=false;
      this.setPage();
  }
    async getHeadend($event = '') {
      // console.log('event',event)
      this.listhead = await this.headends.getHeadend({})
      console.log(this.listhead)
    }


    ClearHeadend(){


       this.profileid ='',
    this.dep_mode_name ='',
    this.op_type =''

    }


    ClearOperator(){
 this.profileid='',
       this.dep_mode_name ='',
      this.op_type =''
    }
   
    async depositemode() {
      this.depositpaymode = await this.deposit.selectdpositemode({userid:this.profileid})
      console.log('depositpaymodeee', this.depositpaymode)
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
    async getoperator() {
      this.operatortypelist = await this.operator.searchoperator({ usertype: this.op_type, hdid: this.headend})
      console.log('listttoperator@@@', this.operatortypelist)
    }
    async getModel() {
      this.getmodellist = await this.stock.getstockmodel({});
      console.log('stb list', this.getmodellist)
    }
   
  }
  