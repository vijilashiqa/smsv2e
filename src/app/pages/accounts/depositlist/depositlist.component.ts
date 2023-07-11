import { Component, OnInit } from '@angular/core';
import { PagerService, RoleservicesService } from '../../_services';
import { DepositService } from '../../_services/deposit.service';
@Component({
  selector: 'ngx-depositlist',
  templateUrl: './depositlist.component.html',
  styleUrls: ['./depositlist.component.scss']
})
export class DepositlistComponent implements OnInit {
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
  channel_type = ''
  channel_mode = '';
  constructor(
    private pageservice: PagerService,
    private deposit :DepositService,
    public role: RoleservicesService,
  ) { 
   
  }

  ngOnInit(): void {
    this.initiallist();
 
  }
  async initiallist() {
    this.loading=true;
    this.listdeposit = await this.deposit.listdeposit({index:(this.page - 1) * this.limit,limit:this.limit });
    console.log('list deposit=====', this.listdeposit)
    this.data = this.listdeposit[0];
    this.count = this.listdeposit[1].count;
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
 
}
