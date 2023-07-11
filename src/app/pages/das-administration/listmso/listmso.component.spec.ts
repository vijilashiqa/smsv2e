import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListmsoComponent } from './listmso.component';

describe('ListmsoComponent', () => {
  let component: ListmsoComponent;
  let fixture: ComponentFixture<ListmsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListmsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListmsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
