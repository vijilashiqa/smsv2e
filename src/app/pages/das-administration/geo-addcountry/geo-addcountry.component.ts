import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
 import { CountryService } from '../../_services';
 import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
 import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-geo-addcountry',
  templateUrl: './geo-addcountry.component.html',
  styleUrls: ['./geo-addcountry.component.scss']
})
export class GeoAddcountryComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; countryForm;editdatas;editdata
  item; result;id;result1;
  @Input() title: string;
   
  constructor(
     private country : CountryService,
      public activeModal: NgbActiveModal,
      private toast: ToastrService,
    ){}

  async ngOnInit(){
    this.createForm();
    if(this.item){
      await this.edit();
      this.createForm();
    }
    
  }
 async Country() {
    this.submit = true;
    if (!this.countryForm.valid) {
      return;
    }
    let method = this.item ? 'editcountrygeo' : 'addcountrygeo'
    if (this.item) this.countryForm.value['country_pk'] = this.item
    let result = await this.country[method](this.countryForm.value)
    if (result && result['status'] == 1) {
      this.toast.success(result['msg']);
      this.close();
    } else {
      this.toast.warning(result['msg'])
    }
  }
  async edit(){
    this.editdata = await this.country.getcountry({ country_pk : this.item });
  }
close(){
    this.activeModal.close();
}
async createForm() {
    this.countryForm = new FormGroup({
      countryname: new FormControl(this.editdata?.country_name || '', Validators.required)
    });
  }
}
