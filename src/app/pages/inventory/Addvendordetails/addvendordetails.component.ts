import { Component, OnInit } from '@angular/core';
import {NbToastrService,} from '@nebular/theme';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeadendService, RoleservicesService, VendorService } from '../../_services';

@Component({
  selector: 'ngx-addbusinessdetails',
  templateUrl: './addvendordetails.component.html',
  styleUrls: ['./addvendordetails.component.scss']
})
export class addvendordetailsComponent implements OnInit {

  submit: boolean; vendor; getvendorlist; editflag = false;
  AddVendordetailsForm; Addvendor; id; item; editable: boolean = false; editdata: any; listhead
  constructor(
    private vendorservices: VendorService,
    private route: Router,
    public role: RoleservicesService,
    private toast: NbToastrService,
    private aRoute: ActivatedRoute,
    private headend: HeadendService
  ) { }

  async ngOnInit() {
    await this.createForm();
    this.id = this.aRoute.snapshot.queryParams.id;
    if (this.role.getroleid() > 777) {
     await  this.getHeadend();
    //  await this.getVendor();
    }
    else{
      this.AddVendordetailsForm.get('hdid').setValue(this.role.getheadend());
      await this.getVendor();
   }
    if (this.id) {
      await  this.edit();
      await this.createForm();
      await  this.getHeadend();
      await this.getVendor();


    }



  }
  async getVendor() {
    this.getvendorlist = await this.vendorservices.getvendor({ hdid: this.AddVendordetailsForm.value['hdid'] });
    console.log("get vendor",this.getvendorlist)

  }
  async getHeadend($event = '') {
    console.log('event', event)
    this.listhead = await this.headend.getHeadend({})
    console.log("headed",this.listhead)
  }

  async edit() {
    this.editdata = await this.vendorservices.getvendordetails({ vendordetid: this.id })
    await this.createForm();
    this.gstValidation();
  }


  gstValidation() {
    if (this.val['gst_type'] == 1) {
      this.addValidation('c_gst', 's_gst');
      this.clearValidation('i_gst')
    } else {
      this.addValidation('i_gst');
      this.clearValidation('c_gst', 's_gst')
    }
  }

  addValidation(...value) {
    for (let i of value) {
      this.AddVendordetailsForm.get(i).setValidators(Validators.required)
    }
  }

  clearValidation(...value) {
    for (let i of value) {
      this.AddVendordetailsForm.get(i).clearValidators();
      this.AddVendordetailsForm.get(i).updateValueAndValidity();
    }
  }



  typeClearheadend(val = '1') {
    this.changeclear('vendorid')
  }

  changeclear(...data) {
    for (let i of data) {
      this.AddVendordetailsForm.controls[i].setValue('');
    }
  }


  async addVendorDetail() {

    const invalid = [];
    const control = this.AddVendordetailsForm.controls
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
      }
    }
    console.log('invalid', invalid);
    this.submit = true;
    if (this.AddVendordetailsForm.invalid) {
      return
    }
    let method = this.id ? 'editvendordetails' : 'addvendordetails'
    console.log('updatelist', method);
    this.AddVendordetailsForm.value['status'] = this.AddVendordetailsForm.value['status'] == true ? 1 : 0;
    if (this.id) this.AddVendordetailsForm.value['id'] = this.id
    let result = await this.vendorservices[method](this.AddVendordetailsForm.value)
    if (result && result[0].err_code == 0) {
      this.toast.success(result[0]['msg']);
      this.route.navigate(['/pages/inventory/Vendordetailslist'])
      console.log("add vendor ", result)
    } else {
      this.toast.warning(result[0]['msg'])

    }
  }
  createForm() {
    this.AddVendordetailsForm = new FormGroup({
      contact_person: new FormControl(this.editdata?.contact_person || '', Validators.required),
      vendorid: new FormControl(this.editdata?.vendorid || '', Validators.required),
      hdid: new FormControl(this.editdata?.hdid || '', Validators.required),
      loc: new FormControl(this.editdata?.loc || '', Validators.required),
      mobile1: new FormControl(this.editdata?.mobile1 || '', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      email: new FormControl(this.editdata?.email || '', Validators.required),
      gst: new FormControl(this.editdata?.gst || '', Validators.required),
      addr: new FormControl(this.editdata?.addr || '', Validators.required),
      cin: new FormControl(this.editdata?.cin || '', Validators.required),
      gst_type: new FormControl(this.editdata?.gst_type || '', Validators.required),
      i_gst: new FormControl(this.editdata?.i_gst || 0),
      c_gst: new FormControl(this.editdata?.c_gst || 0),
      s_gst: new FormControl(this.editdata?.s_gst || 0),
      descr: new FormControl(this.editdata?.descr || ''),
      status: new FormControl(this.editdata ? this.editdata['status'] == 1 ? true : false: true),

    });
  }

  get val() {
    return this.AddVendordetailsForm.value
  }


}
