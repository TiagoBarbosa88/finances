import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should display current year in template', () => {
    const footerElement = fixture.nativeElement;
    const currentYear = new Date().getFullYear();
    expect(footerElement.textContent).toContain(currentYear.toString());
  });

  it('should have correct copyright text', () => {
    const footerElement = fixture.nativeElement;
    expect(footerElement.textContent).toContain('© ' + component.currentYear + ' Controle Financeiro');
  });
});
