import { Component, OnInit } from '@angular/core';
import { CountryService, PagerService, RoleservicesService, VendorService } from '../../_services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddstbtypeComponent } from '../addstbtype/addstbtype.component';
import { BoxtypeService } from '../../_services/boxtype.service';
@Component({
  selector: 'ngx-stb-type',
  templateUrl: './stblist.component.html',
  styleUrls: ['./stblist.component.scss']
})
export class StblistComponent implements OnInit {
  data; count
  pager: any = {}; page: number = 1; pagedItems: any = []; limit = 25;
  loading = false;
  getstbtype: any;

  constructor(
    private country: CountryService,
    private vendorservices: VendorService,
    public pageservice: PagerService,
    private boxtype: BoxtypeService,
    public role: RoleservicesService,
    private modal: NgbModal,

  ) { }


  async ngOnInit() {
    await this.initiallist();
  }
  async initiallist() {
    this.loading = true;
    this.getstbtype = await this.boxtype.listboxtype({ index: (this.page - 1) * this.limit, limit: this.limit });
    console.log('dfgvdg=====', this.getstbtype)
    this.data = this.getstbtype[0];
    this.count = this.getstbtype[1].count;
    this.loading = false;
    this.setPage();

  }
  getlist(page) {
    var total = Math.ceil(this.count / this.limit);
    let result = this.pageservice.pageValidator(this.page, page, total);
    this.page = result['value'];
    if (result['result']) {
      this.initiallist();
    };
  }
  setPage() {
    this.pager = this.pageservice.getPager(this.count, this.page, this.limit);
    this.pagedItems = this.data;
  }
  addstb() {
    const modalRef = this.modal.open(AddstbtypeComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Add STB Type';
    modalRef.result.then((data) => {
      this.initiallist();
    })
  };

  editstb(item) {
    const modalRef = this.modal.open(AddstbtypeComponent, { container: 'nb-layout', backdrop: false });
    modalRef.componentInstance.title = 'Edit STB Type';
    modalRef.componentInstance.item = item
    modalRef.result.then((data) => {
      this.initiallist();
    })
  }
}
