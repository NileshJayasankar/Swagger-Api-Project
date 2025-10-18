import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitcardComponent } from './digitcard.component';

describe('DigitcardComponent', () => {
  let component: DigitcardComponent;
  let fixture: ComponentFixture<DigitcardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitcardComponent]
    });
    fixture = TestBed.createComponent(DigitcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
