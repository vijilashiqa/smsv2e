import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeadendService, RoleservicesService } from '../../_services';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcasterService } from '../../_services/broadcaster.service';
import { ChannelService } from '../../_services/channel.service';

@Component({
  selector: 'ngx-addchannels',
  templateUrl: './addchannels.component.html',
  styleUrls: ['./addchannels.component.scss']
})
export class AddchannelsComponent implements OnInit {
  channelForm; submit: boolean; count; id; lang; genres; headend; broadcasters;
  cou; editable: boolean = false; editdata; editflag = false; result; addchan;
  constructor(
    private headService: HeadendService,
    private channelService: ChannelService,
    private toast: ToastrService,
    private route: Router,
    private aRoute: ActivatedRoute,
    public role: RoleservicesService,
    private broadcasterService: BroadcasterService
  ) { }

  async ngOnInit() {
    this.id = this.aRoute.snapshot.queryParams['id'];
    await this.createForm();
    if (this.role.getroleid() > 777) {
     await  this.getheadend();
     
    } else {
      this.channelForm.get('hdid').setValue(this.role.getheadend());
      await this.Getbroadcasteredit();
      await this.listlang();
    }
    if (this.id) {
      await this.edit();
      await this.createForm();
      await this.listgenre();    
      await this.Getbroadcasteredit();
      await this.listlang();
   
    }
  }
  async getheadend($event = '') {
    this.count = await this.headService.getHeadend({});
  }
  async listlang($event = '') {
    if(this.channelForm.value['hdid']){
    let result = await this.channelService.listlang({ hdid: this.val['hdid'] });
    this.lang = result[0];
    }
  }

  async Getbroadcasteredit($event = '') {
    if(this.channelForm.value['hdid']){
      this.result = await this.broadcasterService.getbroadcaster({ hdid: this.val['hdid'] });
    }
    
  }

  async listgenre($event = '') {
    if(this.channelForm.value['hdid']){
    this.genres = await this.channelService.selectgenere({ hdid: this.val['hdid'], langid: this.val['langid'] });
    console.log('list genre', this.genres)
    }
  }
  typeclearheadend(val = '1') {
    this.changeclear('genreid', 'langid', 'bcid')
  }
  typeclearlang(val = '1') {
    this.changeclear('genreid')
  }
  changeclear(...data) {
    for (let i of data) {
      this.channelForm.controls[i].setValue('');
    }
  }

  async addchannel() {
    {
      this.submit = true;
      console.log('add...', this.val);
      const invalid = [];
      const control = this.channelForm.controls
      for (const name in control) {
        if (control[name].invalid) {
          invalid.push(name);
        }
      }
      if (this.channelForm.invalid) {
        // window.alert('Please fill mandatory fields');
        return;
      }
      console.log('add...', this.val);
      let method = this.id ? 'editchannel' : 'addchannel'
      console.log('updatelist', method);

      if (this.id) this.channelForm.value['id'] = this.id
      this.channelForm.value['status'] = this.channelForm.value['status'] == true ? 1 : 0;
      let result = await this.channelService[method](this.channelForm.value)
      if (result && result[0].err_code == 0) {
        this.toast.success(result[0]['msg']);
        this.route.navigate(['/pages/channelcategory/listchannel'])
      } else {
        this.toast.warning(result[0]['msg'])
        console.log('add...', this.val);
      }
    }
  }
  get ctrl() {
    return this.channelForm.controls
  }
  get val() {
    return this.channelForm.value
  }

  async edit() {
    console.log('edit herer')
    this.addchan = await this.channelService.getchanneledit({ id: this.id });
    console.log('addchan .....', this.addchan)

  }

  createForm() {
    this.channelForm = new FormGroup({
      channame: new FormControl(this.addchan?.channame || '', Validators.required),
      chanmode: new FormControl(this.addchan?.chanmode || '', Validators.required),
      langid: new FormControl(this.addchan?.langid || '', Validators.required),
      genreid: new FormControl(this.addchan?.genreid || '', Validators.required),
      bcid: new FormControl(this.addchan?.bcid || '', Validators.required),
      chantype: new FormControl(this.addchan?.chantype || '', Validators.required),
      hdid: new FormControl(this.addchan?.hdid || '', Validators.required),
      chanlcm: new FormControl(this.addchan?.chanlcm || '', Validators.required),
      status: new FormControl(this.addchan ? this.addchan['status'] == 1 ? true : false : true)
    });

  }
}
