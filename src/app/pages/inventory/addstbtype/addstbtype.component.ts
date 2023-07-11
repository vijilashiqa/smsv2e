import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService, HeadendService, RoleservicesService, VendorService } from '../../_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BoxtypeService } from '../../_services/boxtype.service';
@Component({
  selector: 'ngx-addstbtype',
  templateUrl: './addstbtype.component.html',
  styleUrls: ['./addstbtype.component.scss']
})
export class AddstbtypeComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; addstbtypeForm; editflag = false;editstbtypel
  item; state; editable: boolean = false; editdata = {};listhead
  initialValue; getstates; id; 
   @Input() title: string;
  count;
  constructor(
     private toast: ToastrService,
     private headend : HeadendService,
     private boxtype :BoxtypeService,
     public role: RoleservicesService,
     private activemodel : NgbActiveModal) { }
  async ngOnInit() {
    await this.createForm();
    if (this.role.getroleid() > 777) {
     await    this.getHeadend();
    } else {
      this.addstbtypeForm.get('hdid').setValue(this.role.getheadend());
    }
     if (this.item) {
      console.log('item@@@@@@@@@@',this.item);
      await this.editstbtype();
      await this.createForm();
      // await this.getHeadend();

    
    }
  }
  async getHeadend($event = '') {

    this.listhead = await this.headend.getHeadend({ like: $event })
    console.log(this.listhead)
  }
  async AddState() {
    this.submit = true;
    if (this.addstbtypeForm.invalid) {
      return;
    }
    let method = this.item ? 'editboxtype' : 'addboxtype';
    if (this.item) this.addstbtypeForm.value['boxtypeid'] = this.item;
    this.addstbtypeForm.value['status']= this.addstbtypeForm.value['status'] == true ? 1: 0;
      let result = await this.boxtype[method](this.addstbtypeForm.value)
      if (result && result[0]['err_code'] == 0) {
        this.toast.success(result[0]['msg']);
        this.close();
      } else {
        this.toast.warning(result[0]['msg'])
        // this.close();
      }
    }


    async editstbtype(){

      this.editstbtypel =await this.boxtype.getstbtype({boxtypeid : this.item})
      console.log('edit data%%%%%%%%%%%%%%',this.editstbtypel)
    }


  createForm() {
    this.addstbtypeForm = new FormGroup({
      hdid: new FormControl(this.editstbtypel?.hdid || '', Validators.required),
      boxtypename: new FormControl(this.editstbtypel?.boxtypename || '', Validators.required),
      status: new FormControl(this.editstbtypel ? this.editstbtypel['status'] == 1 ? true : false: true),

    });
  }

  
close(){

  this.activemodel.close();
}

}

