import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService, HeadendService } from '../../_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-geo-addstate',
  templateUrl: './geo-addstate.component.html',
  styleUrls: ['./geo-addstate.component.scss']
})
export class GeoAddstateComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; stateForm; editflag = false;
  item; state; editable: boolean = false; editdata;
  initialValue; getstates; id;
  @Input() title: string;
  count;
  constructor(
    private country: CountryService, private toast: ToastrService,
    private headService: HeadendService,
    private activemodel: NgbActiveModal) { }
  async ngOnInit() {
    this.createForm();
    this.getCountry();
    if (this.item) {
      await this.edit();
      await this.createForm();
    }
  }

  async AddState() {
    this.submit = true;
    if (!this.stateForm.valid) {
      return;
    }
    let method = this.item ? 'editstategeo' : 'addstategeo';
    if (this.item) this.stateForm.value['state_pk'] = this.item;
    let result = await this.country[method](this.stateForm.value)
    if (result && result['status'] == 1) {
      this.toast.success(result['msg']);
      this.close();
    } else {
      this.toast.warning(result['msg'])
    }
  }
  async getCountry($event = '') {
    this.count = await this.country.listcountry({});
  }
  createForm() {
    this.stateForm = new FormGroup({
      country_fk: new FormControl(this.editdata?.country_fk || '', Validators.required),
      state_name: new FormControl(this.editdata?.state_name || '', Validators.required) });
  }
  async edit() {
    this.editdata = await this.country.getstateedit({ state_pk: this.item });
  }

  close() {
    this.activemodel.close();
  }

}
