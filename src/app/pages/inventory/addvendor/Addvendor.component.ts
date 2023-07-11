import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeadendService, RoleservicesService, VendorService } from '../../_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'ngx-createmake',
  templateUrl: './Addvendor.component.html',
  styleUrls: ['./Addvendor.component.scss']
})
export class AddvendorComponent implements OnInit {
  modalHeader: string; listhead; editvendorl;
  submit: boolean = false; createmakeForm;
  item; result;
  @Input() title: string;

  constructor(

    public activeModal: NgbActiveModal,
    private toast: ToastrService,
    private vendor: VendorService,
    private headend: HeadendService,
    public role: RoleservicesService,

  ) { }

  async ngOnInit() {
    await this.createForm();
    if (this.role.getroleid() > 777) {
     await this.getHeadend();
    } else {
      this.createmakeForm.get('hdid').setValue(this.role.getheadend());
    }
    if(this.item){
      await this.editvendorf();
      await this.createForm();
    }
   
  }

  async getHeadend($event = '') {
    this.listhead = await this.headend.getHeadend({})
    console.log(this.listhead)
  }


  async editvendorf() {
    this.editvendorl = await this.vendor.getvendorlist({ vendorid: this.item })
  }



  async addmake() {
    this.submit = true;
    if (!this.createmakeForm.valid) {
      return;
    }
    let method = this.item ? 'editvendor' : 'addvendor'
    if (this.item) this.createmakeForm.value['vendorid'] = this.item;
    this.createmakeForm.value['status'] = this.createmakeForm.value['status'] == true ? 1 : 0;
    let result = await this.vendor[method](this.createmakeForm.value)
    if (result && result[0]['err_code'] == '0') {
      this.toast.success(result[0]['msg']);
      this.close();
    } else {
      this.toast.warning(result[0]['msg'])
    }
  }

  close() {
    this.activeModal.close();
  }


  async createForm() {
    this.createmakeForm = new FormGroup({
      vendor_name: new FormControl(this.editvendorl?.vendor_name || '', Validators.required),
      hdid: new FormControl(this.editvendorl?.hdid || '', Validators.required),
      status: new FormControl(this.editvendorl ? this.editvendorl['status'] == 1 ? true : false: true)
    });
  }
}

