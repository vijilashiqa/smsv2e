import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryService } from '../../_services';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-geo-addcity',
  templateUrl: './geo-addcity.component.html',
  styleUrls: ['./geo-addcity.component.scss']
})
export class GeoAddcityComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; cityform;
  item;

  state: any = []; district: any = []; city; @Input() title: string;
  editflag = false; listarea; keyword = 'name'; count; editdata; citylist; getstates; dist
  constructor(
    private country: CountryService,
    private toast: ToastrService, public activeModal: NgbActiveModal,) { }

  async ngOnInit() {
    this.createForm();
    this.getCountry();
    console.log('item in onint', this.item)
    if (this.item) {
      await this.edit();
      await this.createForm();
      await this.getCountry();
      await this.getstate();
      await this.getdistrict();
      await this.getcity();

    }
  }
  async City() {
    this.submit = true;
    console.log('add...', this.val);
    const invalid = [];
    const control = this.ctrl
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
      }
    }
    if (this.cityform.invalid) {
      console.log('Invalid value -----', invalid);
      window.alert('Please fill mandatory fields');
      return;
    }
    let method = this.item ? 'editcitygeo' : 'addcitygeo';
    if (this.item) this.val['id'] = this.item;
    let result = await this.country[method](this.cityform.value)
    if (result && result['status'] == 1) {
      this.toast.success(result['msg']);
      this.close();
    } else {
      this.toast.warning(result['msg'])
    }
  }


  typeclearcountry(val = '1') {
    this.changeclear('state_fk', 'district_fk')

  }

  typeclearstate(val = '1') {

    this.changeclear('district_fk')


  }


  async edit() {
    this.editdata = await this.country.getcityedit({ id: this.item });
    console.log('edit the data', this.editdata)
  }





  get ctrl() {
    return this.cityform.controls
  }

  changeclear(...data) {
    for (let i of data) {
      this.cityform.controls[i].setValue('');
    }
  }


  async getCountry($event = '') {
    this.count = await this.country.listcountry({ like: $event });
  }
  async getstate($event = '') {
    this.getstates = await this.country.liststate({ country_fk: this.val['country_fk'], like: $event });
  }
  get val() {
    return this.cityform.value
  }
  async getdistrict($event = '') {
    this.dist = await this.country.listdistrict({ state_fk: this.val['state_fk'], like: $event });

  }
  async getcity($event = '') {
    this.citylist = await this.country.listcity({ district_fk: this.val['district_fk'] });
  }
  close() {
    this.activeModal.close();
  }
  createForm() {
    this.cityform = new FormGroup({
      state_fk: new FormControl(this.editdata?.state_fk || '', Validators.required),
      district_fk: new FormControl(this.editdata?.district_fk || '', Validators.required),
      city_name: new FormControl(this.editdata?.city_name || '', Validators.required),
      country_fk: new FormControl(this.editdata?.country_fk || '', Validators.required),
    });
  }



}
