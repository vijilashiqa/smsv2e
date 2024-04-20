import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HeadendService, RoleservicesService } from '../../_services';
import { StbmanagementService } from '../../_services/stbmanagement.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DepositService } from '../../_services/deposit.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'ngx-adddeposit',
  templateUrl: './adddeposit.component.html',
  styleUrls: ['./adddeposit.component.scss']
})
export class AdddepositComponent implements OnInit {
  submit: boolean = false; depositForm; id; item; listhead; operatortype
  head; opt; imageURL: any; selectedfile: File = null; depositlist; loading = false;
  constructor(
    private headend: HeadendService,
    private domSanitizer: DomSanitizer,
    private stb: StbmanagementService,
    private deposits: DepositService,
    private route: Router,
    public role: RoleservicesService,
    private toast: ToastrService,
  ) { }
  async ngOnInit() {
  await this.createForm();
    if (this.role.getroleid() > 777) {
      this.getHeadend();
    }
    else {
      this.depositForm.get('hdid').setValue(this.role.getheadend());
    }
    this.selectdeposit();
  }



  handleFile(file: FileList) {
    this.selectedfile = file.item(0);
    if (this.selectedfile) {
      var reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageURL = this.domSanitizer.bypassSecurityTrustUrl(event.target.result)
      }
      reader.readAsDataURL(this.selectedfile);
    } else {
      this.imageURL = '';
    }
  }


  async getHeadend() {
    this.listhead = await this.headend.getHeadend({});
  }
  async selectdeposit() {
    console.log('deposit')
    this.depositlist = await this.deposits.selectdpositemode({})
    console.log("deposit list ", this.depositlist)
  }
  async getoperatortypef() {
    this.operatortype = await this.stb.getoperatortype({ usertype: this.depositForm.value["role"], hdid: this.depositForm.value["hdid"] });
    console.log("operator type ", this.operatortype);
  }

  async deposit() {
    this.submit = true;
    const invalid = [];
    const control = this.depositForm.controls
    for (const name in control) {
      if (control[name].invalid) {
        invalid.push(name);
        console.log('error', name)
      }
    }
    if (this.depositForm.invalid) {
      window.alert('Please fill mandatory fields');
      return;
    }
    let result = await this.deposits.adddeposite(this.depositForm.value);
    console.log('result ', result)
    if (result[0]['err_code'] == 0 && !this.id) {
      const file = new FormData();
      let id = result[0]['id']
      let filename = id + '-' + 'deposit'

    console.log("select file", this.selectedfile);
    
      file.append('file', this.selectedfile, filename)
      file.append('id', id)
      console.log("file @@@@@@",file)
      let logoresult = await this.deposits.uploadpic(file)
      if (logoresult && result[0].err_code == 0) {
        this.toast.success(result[0]['msg']);
        this.route.navigate(['/pages/accounts/depositlist'])
      } else {
        this.toast.warning(result[0]['msg'])
        console.log('add...', this.depositForm.value);

      }
    }

  }



  changeclear(...data) {
    for (let i of data) {
      this.depositForm.controls[i].setValue("");
    }
  }

  typeoperator() {
    this.changeclear('userid');
  }



  clearheaddend(){
this.changeclear('role','userid')

  }
  createForm() {
    this.depositForm = new FormGroup({
      hdid: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      userid: new FormControl('', Validators.required),
      deposit_amount: new FormControl('', Validators.required),
      paymode: new FormControl('', Validators.required),
      note: new FormControl('',),
      utr: new FormControl('',),
      img: new FormControl(''),
      deposit_type: new FormControl('', Validators.required)
    });
  }

}
