import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HeadendService, RoleservicesService } from '../../_services';
import { ChannelService } from '../../_services/channel.service';

@Component({
  selector: 'ngx-addlang',
  templateUrl: './addlang.component.html',
  styleUrls: ['./addlang.component.scss']
})
export class AddlangComponent implements OnInit {
  addlanguageForm; submit: boolean;
   @Input() title: string;
   item : any;
  listhead;listlang;data;id;langid;
  constructor(private activemodel: NgbActiveModal, 
    private headend :HeadendService,
    private channel :ChannelService,
    public role: RoleservicesService,
     private toast: ToastrService) { }


  async ngOnInit() {
    console.log('Item----', this.item);
    await this.createForm()
    if(this.item){
      await this.editlang();
      await this.createForm();
    }
    if (this.role.getroleid() > 777 ) {
      this.getHeadend();
      } else {
        this.addlanguageForm.get('hdid').setValue(this.role.getheadend());
      }
  }
  async getHeadend($event = '') {

    this.listhead = await this.headend.getHeadend({ like: $event })
    console.log(this.listhead)
  }

async editlang(){

  this.listlang =await this.channel.getchannellang({langid : this.item})
  console.log('edit data%%%%%%%%%%%%%%',this.listlang)
}



  async addchannel() {
    this.submit = true;
    if (this.addlanguageForm.invalid) {
      // window.alert('Please fill the mandatory fields')
      return;
    }
    let method = this.item ? 'editlanguage' : 'addlanguage';
    if (this.item) this.addlanguageForm.value['langid'] = this.item;
      console.log('language ========', this.item)
      this.addlanguageForm.value['status']= this.addlanguageForm.value['status'] == true ? 1: 0;
      let result = await this.channel[method](this.addlanguageForm.value)
      if (result && result[0]['err_code'] == 0) {
        this.toast.success(result[0]['msg']);
        this.close();
      } else {
        this.toast.warning(result[0]['msg'])
        console.log('add...', this.addlanguageForm.value);
      } 
  }
  close() {
    this.activemodel.close();
  }
  createForm() {
    this.addlanguageForm = new FormGroup({
      hdid:new FormControl(this.listlang?.hdid  || '', Validators.required),
      langname: new FormControl(this.listlang?.langname || '', Validators.required),
      status: new FormControl(this.listlang ? this.listlang['STATUS'] == 1 ? true : false: true),
      // status: new FormControl(this.listlang?.STATUS),
    });
  }
}

