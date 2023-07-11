import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../_services';

@Component({
  selector: 'ngx-geo-adddistrict',
  templateUrl: './geo-adddistrict.component.html',
  styleUrls: ['./geo-adddistrict.component.scss']
})
export class GeoAdddistrictComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; districtForm; getstates; count; editflag = false; dist;
  item; editdata
  state: any = []; district; editdatas;
  @Input() title: string;
  constructor(
    private toast: ToastrService,
    public activeModal: NgbActiveModal,
    private country: CountryService,) { }

  async ngOnInit() {
    this.createForm();
    this.getCountry();
    console.log('Item----', this.item);
    if (this.item) {
    await  this.edit();
   await   this.createForm();
    await  this.getCountry();
  await    this.getstate()
    //  await this.createForm();
    }
  }

  async District() {
    this.submit = true;
    if (!this.districtForm.valid) {
      return;
    }
    let method = this.item ? 'editDistrictgeo' : 'addDistrictgeo'
    if (this.item) this.val['district_pk'] = this.item;
    let result = await this.country[method](this.districtForm.value)
    if (result && result['status'] == 1) {
      this.toast.success(result['msg']);
      this.close();
    } else {
      this.toast.warning(result['msg'])
      console.log('add...', this.districtForm.value);
    }
  }
  close() {
    this.activeModal.close();
  }

  typecleardist(val = '1') {
    this.changeclear('state_fk')

  }


  changeclear(...data) {
    for (let i of data) {
      this.districtForm.controls[i].setValue('');
    }
  }



  async getCountry($event = '') {
    console.log('Country Event----', $event);
    this.count = await this.country.listcountry({ like: $event });
    console.log('country', this.count);
  }
  async getstate($event = '') {
    this.getstates = await this.country.liststate({ country_fk: this.val['country_fk'], like: $event });
  }
  get val() {
    return this.districtForm.value
  }

  async edit() {
    this.editdata = await this.country.getdistrictedit({ district_pk: this.item });
    console.log('edit the data', this.editdata)
  }

  createForm() {
    this.districtForm = new FormGroup({
      country_fk: new FormControl(this.editdata?.country_fk ||'', Validators.required),
      state_fk: new FormControl(this.editdata?.state_fk ||'', Validators.required),
      district_name: new FormControl(this.editdata?.district_name || '', [Validators.required])
    });
  }

}
