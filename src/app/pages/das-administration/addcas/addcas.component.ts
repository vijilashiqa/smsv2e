import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CountryService, HeadendService } from '../../_services';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-addcas',
  templateUrl: './addcas.component.html',
  styleUrls: ['./addcas.component.scss']
})
export class AddcasComponent implements OnInit {
  modalHeader: string;
  submit: boolean = false; addcasForm; editflag = false;
  item; state; editable: boolean = false; editdata = {}
  initialValue; getstates; id; editcaslist
   @Input() title: string;
  count;
  constructor(  
     private toast: ToastrService,
     private headService: HeadendService,
     private activemodel : NgbActiveModal) { }

     
  async ngOnInit() {
      await this.createForm();
     if (this.item) {
      console.log('iteam ==========',this.item);
      await  this.editcas();
      await this.createForm();
    
    }
  }

  async Addcas() {
    this.submit = true;
    if (!this.addcasForm.valid) {
      return;
    }
    let method = this.item ? 'editcas' : 'addcas';
    if (this.item) this.addcasForm.value['casid'] = this.item;
      console.log('CAS ADDED========',this.item)
      let result = await this.headService[method](this.addcasForm.value)
      if (result && result[0]['err_code'] == 0) {
        this.toast.success(result[0]['msg']);
        this.close();
      } else {
        this.toast.warning(result[0]['msg'])
        console.log('add...', this.addcasForm.value);
      }
    }



    async editcas(){

      this.editcaslist =await this.headService.gethdcasedit({casid: this.item})
 console.log('edit data%%%%%%%%%%%%%%',this.editcaslist)
    }



  createForm() {
    this.addcasForm = new FormGroup({
      casname: new FormControl(this.editcaslist?.casname || '', Validators.required)
    });
  }

  
close(){
  this.activemodel.close();
}

}