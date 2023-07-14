import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalchannelComponent } from './renewalchannel.component';

describe('RenewalchannelComponent', () => {
  let component: RenewalchannelComponent;
  let fixture: ComponentFixture<RenewalchannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalchannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalchannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
