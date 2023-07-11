import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HeadendService } from '../../_services';
import { StbmanagementService } from '../../_services/stbmanagement.service';
import { ToastrService } from 'ngx-toastr';
import { OperatorService } from '../../_services/operator.service';
@Component({
  selector: 'ngx-stbparing',
  templateUrl: './stbparing.component.html',
  styleUrls: ['./stbparing.component.scss']
})
export class StbparingComponent implements OnInit {
  submit: boolean = false; pairForm; listhead; listvc; checkpair; pairflg; getvclist; listhdcas
  @Input() title: string; listboxpair; result; pair_status; getboxlist; box; vc;getoperatorlist
  constructor(
    private activemodel: NgbActiveModal,
    private headend: HeadendService,
    private toast: ToastrService,
    private operator :OperatorService,
    private stb: StbmanagementService) { }

  async ngOnInit() {
    await this.createForm();
    await this.getHeadend();

  }

  async paring() {
    this.submit = true;
    const invalid = [];
    const control = this.pairForm.controls
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.pairForm.invalid) {
      console.log('Invalid value -----', invalid);
      return;
    }
    this.result = await this.stb.addstbpair(this.pairForm.value)
    console.log('result', this.result)
    if (this.result && this.result[0].err_code == 0) {
      this.toast.success(this.result[0]['msg']);
      this.close();
    } else {
      this.toast.warning(this.result[0]['msg'])
    }
  }


  async getoperator(event ='' ) {
    if( this.pairForm.value['hdid']){
      this.getoperatorlist = await this.operator.getuser({ hdid: this.pairForm.value['hdid'] , like :event})

    }
  }
  async boxparing(event='',flag=1) {
    if(this.pairForm.value["hdid"]){
    if(flag == 1){  //BOX
      this.listboxpair = await this.stb.getboxvcpair({ hdid: this.pairForm.value['hdid'] , casid : this.pairForm.value['casid'],pairstatus : this.pairForm.value['pairstatus'],box_like:event ,userid : this.pairForm.value['userid']})
    }
    if(flag ==2){  // VC 
      this.listvc = await this.stb.getboxvcpair({ hdid: this.pairForm.value['hdid'] , casid : this.pairForm.value['casid'] ,  pairstatus : this.pairForm.value['pairstatus'],vc_like:event , userid : this.pairForm.value['userid']})
    }
  }
  }



  async vcparing() {
    console.log('listboxpair in funxction', this.value['boxno'])
    const boxvc_data = this.listboxpair?.filter(x => x.boxid == this.value['boxno'])
    console.log('vcid here', boxvc_data); 
    const [{pairflg}] = boxvc_data;
    this.pair_status =pairflg;
    console.log("pair status @@@@@",this.pair_status)
    this.listvc = [];
    if (boxvc_data[0].vcid) {
      console.log("boxdata@@@@@@@@", boxvc_data[0].vcid)
      this.listvc = [{ vcid: boxvc_data[0].vcid, vcno: boxvc_data[0].vcno }]
      console.log('listvc**********', this.listvc)
      this.ctrl.vcid.setValue(boxvc_data[0].vcid)
    } else {
      const data = []
      let vclist = this.listboxpair.filter(x => x.vcno !== 0 && x.vcno !== null)
      console.log('empty list',vclist)
        vclist.reduce((a, v) => {
        const value = { vcid: v.vcid, vcno: v.vcno }
        data.push(value)
        return data
      }, [])
      console.log("data",data)
      this.listvc = vclist
      console.log('vclist', vclist);
    }
  }

  getVcBoxpairData(){
     const boxvc_data = this.listvc?.filter(x => x.vcid == this.value['vcid'])
    console.log('vcid here', boxvc_data);
    if (boxvc_data[0].boxid) {
      this.listboxpair = [{ boxid: boxvc_data[0].boxid, boxno: boxvc_data[0].boxno }]
      this.ctrl.boxno.setValue(boxvc_data[0].boxid)
    }
  }


  
  async getHeadend($event = '') {
    this.listhead = await this.headend.getHeadend({})
    console.log(this.listhead)
  }

  close() {
    this.activemodel.close();
  }

  async getcashead($event = "") {
    if(this.pairForm.value["hdid"]){
      this.listhdcas = await this.headend.listHdcas({ hdid: this.pairForm.value["hdid"], like: $event });
      this.listhdcas = this.listhdcas[0];
    } 
  }



  async getbox( $event = "") {
    if(this.pairForm.value["hdid"]){
    this.getboxlist = await this.stb.getbox({ like: $event  , hdid: this.pairForm.value['hdid'], casid: this.pairForm.value['casid'], pairstatus: this.pairForm.value['pairstatus']  ,userid : this.pairForm.value['userid']})
  }
  }


  async getvc($event = "") {
    if(this.pairForm.value["hdid"]){
    this.getvclist = await this.stb.getboxvc({ like: $event ,hdid: this.pairForm.value['hdid'], casid: this.pairForm.value['casid'], pairstatus: this.pairForm.value['pairstatus'] ,userid : this.pairForm.value['userid']})
    }
  }

  changeclear(...data) {
    for (let i of data) {
      this.pairForm.controls[i].setValue("");
    }
  }

  typeclear(val = "1") {
    this.changeclear('hdid','casid', 'boxno', 'vcid' , 'userid');
  }


  createForm() {
    this.pairForm = new FormGroup({
      hdid: new FormControl('', Validators.required),
      casid: new FormControl("", Validators.required),
      pairstatus: new FormControl('0'),
      boxno: new FormControl('', Validators.required),
      vcid: new FormControl('', Validators.required),
      userid : new FormControl('', Validators.required)
    });
  }

  get value() {
    return this.pairForm.value;
  }

  get ctrl(){
    return this.pairForm.controls;
  }

}