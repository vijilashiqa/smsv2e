
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PackageService } from '../../_services';
@Component({
  selector: 'ngx-renewalchannel',
  templateUrl: './renewalchannel.component.html',
  styleUrls: ['./renewalchannel.component.scss']
})
export class RenewalchannelComponent implements OnInit {
  modalHeader: string;
  categoryForm; item;
  channel; 
  submit: boolean;


  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private pack: PackageService,
  ) { }


  
  ngOnInit() {
    console.log('itemmm shw',this.item);
    
    this.channellist();
  };
 async channellist() {
  this.channel = this.item.channame
    console.log('item',this.channel);

    };
}
