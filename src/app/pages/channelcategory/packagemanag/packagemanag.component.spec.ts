import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagemanagComponent } from './packagemanag.component';

describe('PackagemanagComponent', () => {
  let component: PackagemanagComponent;
  let fixture: ComponentFixture<PackagemanagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackagemanagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagemanagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
