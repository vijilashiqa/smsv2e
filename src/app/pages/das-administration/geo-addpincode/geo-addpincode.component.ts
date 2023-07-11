import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../_services';

@Component({
  selector: 'ngx-geo-addpincode',
  templateUrl: './geo-addpincode.component.html',
  styleUrls: ['./geo-addpincode.component.scss']
})
export class GeoAddpincodeComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; PincodeForm;
  item; pin;editdata
  @Input() title: string;

  constructor(public activeModal: NgbActiveModal, private country: CountryService,
    private toast: ToastrService,
  ) { }

  async ngOnInit() {
    await this.createForm();
    console.log('Item----', this.item);
    if(this.item){
      await   this.edit();
      await this.createForm();
    }

  }

  async addPin() {
    this.submit = true;
    // console.log('addpin submit================ ', this.item)
    if (!this.PincodeForm.valid) {
      return;
    }
    let method = this.item ? 'editPincodegeo' : 'addPincodegeo';
    if (this.item) this.PincodeForm.value['id'] = this.item;
      let result = await this.country[method](this.PincodeForm.value)
      if (result && result['status'] == 1) {
        this.toast.success(result['msg']);
        this.close();
      } else {
        this.toast.warning(result['msg'])
        console.log('add...', this.PincodeForm.value);
      }
    
  }


  async edit(){
    this.editdata = await this.country.getpincodeedit({ id : this.item });  
    console.log('editdata@@@@@@@@@@',this.editdata)
  }


  close() {
    this.activeModal.close();
  }

  createForm() {
    this.PincodeForm = new FormGroup({
      pincode: new FormControl(this.editdata?.pincode || '', Validators.required)
    });
  }
}
