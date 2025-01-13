import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciageneralComponent } from './asistenciageneral.component';

describe('AsistenciageneralComponent', () => {
  let component: AsistenciageneralComponent;
  let fixture: ComponentFixture<AsistenciageneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsistenciageneralComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AsistenciageneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
