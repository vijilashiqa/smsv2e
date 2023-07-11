import { Component, Input, OnInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HeadendService, RoleservicesService } from '../../_services';
import { ChannelService } from '../../_services/channel.service';

@Component({
  selector: 'ngx-addgenre',
  templateUrl: './addgenre.component.html',
  styleUrls: ['./addgenre.component.scss']
})
export class AddgenreComponent implements OnInit {
  addgenerForm; submit: boolean = false; modalHeader: string; listlang; data; editlang
  boolean = false; stateForm; editflag = false;
  item; state; editable: boolean = false; editdata ; listhead;
  initialValue; getstates; id;
  @Input() title: string;
  count;
  constructor(private toast: ToastrService,
    private channel: ChannelService,
    private route: Router,
    public role: RoleservicesService,
    private headend: HeadendService,
    private activemodel: NgbActiveModal) { }

  async ngOnInit() {
    await this.createForm();
    if (this.role.getroleid() > 777 ) {
      await this.getHeadend();
      } else {
           await this.getlang();
        this.addgenerForm.get('hdid').setValue(this.role.getheadend());
      }

    if (this.item){
      await this.editgenre();
      await this.createForm();
      await this.getlang();
    }
  }

  async getlang($event = '') {
    if(this.addgenerForm.value['hdid']){
      this.listlang = await this.channel.listlang({ hdid: this.addgenerForm.value['hdid'] });
      this.data = this.listlang[0];
    }
   }


   async editgenre(){
    this.editlang =await this.channel.getchannelgenre({genreid : this.item})
  }
  
  async getHeadend($event = '') {
    this.listhead = await this.headend.getHeadend({ like: $event })
    console.log(this.listhead)
  }

  async Addgenre() {
    this.submit = true;
    if (this.addgenerForm.invalid) {
      return;
    }
    let method = this.item ? 'editgenre' : 'addgenre';
    if (this.item) this.addgenerForm.value['genreid'] = this.item;
    this.addgenerForm.value['status']= this.addgenerForm.value['status'] == true ? 1: 0;
    let result = await this.channel[method](this.addgenerForm.value)
    if (result && result[0].err_code == 0) {
      this.toast.success(result[0]['msg']);
     this.close();
    } else {
      this.toast.warning(result[0]['msg'])
    
    }
  }
  close() {
    this.activemodel.close();
  }

  typeClear(val = '1') {
    this.changeclear('langid')
      }
  changeclear(...data) {
    for (let i of data) {
      this.addgenerForm.controls[i].setValue('');
    }
  }
  createForm() {
    this.addgenerForm = new FormGroup({
      hdid: new FormControl( this.editlang?.hdid  || '', Validators.required),
      langid: new FormControl( this.editlang?.langid  || '', Validators.required),
      genrename: new FormControl( this.editlang?.genrename  || '', Validators.required),
      status: new FormControl(this.editlang ? this.editlang['status'] == 1 ? true : false: true),
    });
  }








}
