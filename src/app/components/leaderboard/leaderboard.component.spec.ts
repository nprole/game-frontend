import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, Directive, Input, NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MockModule } from 'ng-mocks';
import { LeaderboardComponent } from './leaderboard.component';
import { LeaderboardService, LeaderboardEntry } from '../../services/leaderboard.service';
import { AuthService } from '../../services/auth.service';
import { of, throwError, NEVER } from 'rxjs';
import { By } from '@angular/platform-browser';

// Stub for routerLink
@Directive({ selector: '[routerLink]' })
class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
}
@NgModule({ declarations: [RouterLinkStubDirective], exports: [RouterLinkStubDirective] })
class RouterLinkStubModule {}

// Mock NavbarComponent to avoid dependency issues
@Component({
  selector: 'app-navbar',
  template: '<div class="mock-navbar">Mock Navbar</div>',
  standalone: true
})
class MockNavbarComponent {}

class MockLeaderboardService {
  getLeaderboard() {
    return of([]);
  }
}

class MockAuthService {
  isLoggedIn() { return true; }
  getCurrentUser() { return null; }
  logout() {}
  getPlayerStats() { return of({ level: 1, xp: 100, gold: 500, diamonds: 50, rubies: 10 }); }
}

class MockActivatedRoute {
  url = of([]);
  params = of({});
  queryParams = of({});
  fragment = of(null);
  data = of({});
  outlet = 'primary';
  component = null;
  snapshot = {
    url: [],
    params: {},
    queryParams: {},
    fragment: null,
    data: {},
    outlet: 'primary',
    component: null,
  };
  root = {
    url: of([]),
    params: of({}),
    queryParams: of({}),
    fragment: of(null),
    data: of({}),
    outlet: 'primary',
    component: null,
    snapshot: {
      url: [],
      params: {},
      queryParams: {},
      fragment: null,
      data: {},
      outlet: 'primary',
      component: null,
    }
  };
}

describe('LeaderboardComponent', () => {
  let component: LeaderboardComponent;
  let fixture: ComponentFixture<LeaderboardComponent>;
  let service: LeaderboardService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [LeaderboardComponent, HttpClientTestingModule, MockModule(RouterModule)],
      providers: [
        { provide: LeaderboardService, useClass: MockLeaderboardService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(LeaderboardService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show loading spinner while loading', () => {
    // Arrange: spy on getLeaderboard to never emit
    spyOn(service, 'getLeaderboard').and.returnValue(NEVER);
    // Act: call ngOnInit which sets loading = true
    component.ngOnInit();
    fixture.detectChanges();
    // Assert: spinner should be present
    const spinner = fixture.debugElement.query(By.css('.loading-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should display leaderboard data', () => {
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: 'A', level: 10, experience: 1000 },
      { rank: 2, username: 'B', level: 9, experience: 900 },
    ];
    spyOn(service, 'getLeaderboard').and.returnValue(of(mockData));
    component.loadLeaderboard();
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.table-row'));
    expect(rows.length).toBe(2);
  });

  it('should show error state on error', () => {
    spyOn(service, 'getLeaderboard').and.returnValue(throwError(() => new Error('API error')));
    component.loadLeaderboard();
    fixture.detectChanges();
    expect(component.error).toBeTrue();
    const errorEl = fixture.debugElement.query(By.css('.error-container'));
    expect(errorEl).toBeTruthy();
  });
});
