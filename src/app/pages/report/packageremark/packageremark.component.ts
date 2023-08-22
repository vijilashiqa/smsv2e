import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToasterService, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { FormControl, FormGroup, Validators, FormArray, FormBuilder, } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PackageService } from '../../_services';

@Component({
  selector: 'ngx-packageremark',
  templateUrl: './packageremark.component.html',
  styleUrls: ['./packageremark.component.scss']
})
export class PackageremarkComponent implements OnInit {
  modalHeader: string;
  categoryForm; item;
  logmsg; 
  submit: boolean;
  constructor(
    public activeModal: NgbActiveModal,
    private alert: ToasterService,
    private pack: PackageService,
    
  ) { }

  ngOnInit() {
    console.log('item show',this.item);
    
    this.packagelog();
  };
  
 async packagelog() {
   if(this.item.logmsg == null ){
    this.logmsg==  'No data Found';
   }
   else{
    this.logmsg = this.item.logmsg.split('.');

   }
    console.log('item', this.item.logmsg);
 };
  };

