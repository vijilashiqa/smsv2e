import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmsoComponent } from './addmso.component';

describe('AddmsoComponent', () => {
  let component: AddmsoComponent;
  let fixture: ComponentFixture<AddmsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddmsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddmsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
