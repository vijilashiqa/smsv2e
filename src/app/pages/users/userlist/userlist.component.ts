import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as JSXLSX from 'xlsx';
import { UserService } from '../../../@core/mock/users.service';
import { HeadendService, PagerService, RoleservicesService } from '../../_services';
import { OperatorService } from '../../_services/operator.service';
import { UserhdcasComponent } from '../userhdcas/userhdcas.component';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Component({
  selector: 'ngx-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
  broadcaster = ''; broadlist: any = []; genre = ''; genres; lang; channelForm; pager: any = {}; page: number = 1;
  pagedItems: any = []; limit = 25; getcitylist; data; count; listchannel; listoperator; loc = ''; branch = ''; headend = '';
  status = ''; profileid = ''; listhead; operatortypelist; op_type = ''; operator_name = ''; search: boolean = false; loading = false;
  now: any;
  constructor(
    private modal: NgbModal,
    private pageservice: PagerService,
    private operator: OperatorService,
    public role: RoleservicesService,
    private headends: HeadendService
  ) { }

  async ngOnInit() {
    await this.initiallist();
    if (this.role.getroleid() > 777) {
      this.getHeadend();
    } else {
      this.headend = JSON.parse(localStorage.getItem('userinfo'))['hdid'];
    }
  }
  async initiallist() {
    this.loading = true;
    this.listoperator = await this.operator.listoperator({
      index: (this.page - 1) * this.limit,
      limit: this.limit,
      hdid: this.headend,
      status: this.status,
      usertype: this.op_type,
      id: this.profileid
    });
    this.data = this.listoperator[0];
    console.log("user list ", this.data)
    this.count = this.listoperator[1].count;
    this.loading = false;
    this.setPage();

  }

  update(item) {
    const modalRef = this.modal.open(UserhdcasComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'ADD HDCAS';
    modalRef.componentInstance.item = item
    modalRef.result.then((data) => {
      this.initiallist();
    })
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
  }
  async getHeadend($event = '') {
    this.listhead = await this.headends.getHeadend({})
    console.log(this.listhead)
  }
  setPage() {
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }



  async Download() {
    this.listoperator = await this.operator.listoperator(
      {
        id: this.operator_name,
        loc: this.loc,
        branch: this.branch,
        head: this.headend,
        status: this.status,
        user_type: this.op_type
      })
    this.data = this.listoperator[0];
    if (this.data) {
      let tempdata = [], temp: any = this.data;
      for (var i = 0; i < temp.length; i++) {
        let parm = {};
        parm['Operator Type'] = temp[i]['rolename'];
        parm['Operator Name'] = temp[i]['fullname'];
        parm['Business Name'] = temp[i]['business_name'];
        parm['Mobile Number'] = temp[i]['mobile'];
        parm['Email ID'] = temp[i]['email1'];
        tempdata[i] = parm;
      }
      const worksheet: JSXLSX.WorkSheet = JSXLSX.utils.json_to_sheet(tempdata);
      const wb: JSXLSX.WorkBook = JSXLSX.utils.book_new();
      JSXLSX.utils.book_append_sheet(wb, worksheet, 'Sheet1');
      JSXLSX.writeFile(wb, 'Operator List-' + (this.now) + EXCEL_EXTENSION);
    }

  }

}
