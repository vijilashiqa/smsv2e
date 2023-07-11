import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddlangComponent } from '../addlang/addlang.component';
import { PagerService, RoleservicesService } from '../../_services';
import { ChannelService } from '../../_services/channel.service';

@Component({
  selector: 'ngx-listlanguage',
  templateUrl: './listlanguage.component.html',
  styleUrls: ['./listlanguage.component.scss']
})
export class ListlanguageComponent implements OnInit {
  pager: any = {}; page: number = 1; pagedItems: any = []; 
  limit = 25;getlistarea;data;count;loading=false;
  constructor(private modal: NgbModal,
    private channel: ChannelService,
    private pageservice :PagerService,
    public role: RoleservicesService,) { }

  async ngOnInit(){
  await this.initiallist()
  }
  
  async initiallist() {
    this.loading=true;
    this.getlistarea = await this.channel.listlang({index:(this.page - 1) * this.limit,limit:this.limit});
    console.log('area=====', this.getlistarea)
    this.data = this.getlistarea[0];
    console.log('dsfsdfsdf',this.data)
    this.count = this.getlistarea[1].count;
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
  
  addlang(){
    const modalRef = this.modal.open(AddlangComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Add Language';
    modalRef.result.then((data) => {
      this.initiallist();
    })
  }
  Edit(langid) {
    console.log('lang id@@@@@@@@@@@@@@@@',langid)
    const modalRef = this.modal.open(AddlangComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Edit Language';
    modalRef.componentInstance.item = langid 
    modalRef.result.then((data) => {
    this.initiallist();
  })
}
}
