import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyList } from './my-list';

describe('MyList', () => {
  let component: MyList;
  let fixture: ComponentFixture<MyList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
