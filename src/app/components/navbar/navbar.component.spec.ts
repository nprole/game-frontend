import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Component, Directive, Input, NgModule } from '@angular/core';
import { MockModule } from 'ng-mocks';

import { NavbarComponent } from './navbar.component';
import { AuthService, PlayerStats } from '../../services/auth.service';

// Stub for routerLink
@Directive({ selector: '[routerLink]' })
class RouterLinkStubDirective {
  @Input('routerLink') linkParams: any;
}
@NgModule({ declarations: [RouterLinkStubDirective], exports: [RouterLinkStubDirective] })
class RouterLinkStubModule {}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockPlayerStats: PlayerStats = {
    level: 5,
    xp: 250,
    gold: 1000,
    diamonds: 75,
    rubies: 15,
  };

  const mockCurrentUser = {
    id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getCurrentUser',
      'getPlayerStats',
      'isLoggedIn',
      'logout',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], {
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
      },
      root: {
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
      }
    });

    await TestBed.configureTestingModule({
      imports: [NavbarComponent, HttpClientTestingModule, MockModule(RouterModule)],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  describe('ngOnInit', () => {
    it('should initialize current user and load player stats', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockCurrentUser);
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getPlayerStats.and.returnValue(of(mockPlayerStats));

      component.ngOnInit();

      expect(component.currentUser).toEqual(mockCurrentUser);
      expect(mockAuthService.getPlayerStats).toHaveBeenCalled();
    });

    it('should not load player stats if user is not logged in', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockCurrentUser);
      mockAuthService.isLoggedIn.and.returnValue(false);

      component.ngOnInit();

      expect(mockAuthService.getPlayerStats).not.toHaveBeenCalled();
    });

    it('should setup refresh event listener', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockCurrentUser);
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getPlayerStats.and.returnValue(of(mockPlayerStats));

      const addEventListenerSpy = spyOn(window, 'addEventListener');

      component.ngOnInit();

      expect(addEventListenerSpy).toHaveBeenCalledWith('refreshNavbarStats', jasmine.any(Function));
    });
  });

  describe('loadPlayerStats', () => {
    it('should load and set player stats successfully', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getPlayerStats.and.returnValue(of(mockPlayerStats));

      component.loadPlayerStats();

      expect(component.playerStats).toEqual(mockPlayerStats);
      expect(component.xpPercentage).toBeGreaterThan(0);
    });

    it('should handle error when loading player stats', () => {
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getPlayerStats.and.returnValue(throwError(() => 'API Error'));

      const consoleSpy = spyOn(console, 'error');

      component.loadPlayerStats();

      expect(consoleSpy).toHaveBeenCalledWith('Error loading player stats:', 'API Error');
      expect(component.playerStats).toBeNull();
    });

    it('should not load stats if user is not logged in', () => {
      mockAuthService.isLoggedIn.and.returnValue(false);

      component.loadPlayerStats();

      expect(mockAuthService.getPlayerStats).not.toHaveBeenCalled();
    });
  });

  describe('calculateXpPercentage', () => {
    it('should calculate XP percentage correctly', () => {
      component.playerStats = {
        level: 1,
        xp: 60,
        gold: 500,
        diamonds: 50,
        rubies: 10,
      };

      component.calculateXpPercentage();

      expect(component.xpPercentage).toBe(50); // 60 / 120 * 100
    });

    it('should handle max percentage of 100', () => {
      component.playerStats = {
        level: 1,
        xp: 150,
        gold: 500,
        diamonds: 50,
        rubies: 10,
      };

      component.calculateXpPercentage();

      expect(component.xpPercentage).toBe(100);
    });

    it('should handle null player stats', () => {
      component.playerStats = null;

      component.calculateXpPercentage();

      expect(component.xpPercentage).toBe(0);
    });
  });

  describe('getXpForLevel', () => {
    it('should calculate XP for levels 1-10 correctly', () => {
      expect(component.getXpForLevel(1)).toBe(120);
      expect(component.getXpForLevel(5)).toBe(200);
      expect(component.getXpForLevel(10)).toBe(300);
    });

    it('should calculate XP for levels above 10 correctly', () => {
      expect(component.getXpForLevel(11)).toBe(186);
      expect(component.getXpForLevel(20)).toBe(239);
    });
  });

  describe('logout', () => {
    it('should logout user and navigate to login', () => {
      component.logout();

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('template rendering', () => {
    it('should display player stats when available', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockCurrentUser);
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getPlayerStats.and.returnValue(of(mockPlayerStats));

      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.navbar')).toBeTruthy();
      expect(compiled.textContent).toContain('Level 5');
      expect(compiled.textContent).toContain('1,000'); // Gold
      expect(compiled.textContent).toContain('75'); // Diamonds
      expect(compiled.textContent).toContain('15'); // Rubies
      expect(compiled.textContent).toContain('testuser');
    });

    it('should not display stats when player stats are null', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockCurrentUser);
      mockAuthService.isLoggedIn.and.returnValue(false);

      component.ngOnInit();
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).not.toContain('Level');
      expect(compiled.textContent).toContain('testuser');
    });

    it('should display XP progress bar with correct width', () => {
      component.playerStats = mockPlayerStats;
      component.currentUser = mockCurrentUser;
      component.xpPercentage = 75;
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('.bg-gradient-to-r') as HTMLElement;
      expect(progressBar.style.width).toBe('75%');
    });

    it('should display correct XP text', () => {
      component.playerStats = mockPlayerStats;
      component.currentUser = mockCurrentUser;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('250/200 XP'); // Current XP / XP needed for level 5
    });
  });

  describe('refresh event listener', () => {
    it('should reload stats when refresh event is triggered', () => {
      mockAuthService.getCurrentUser.and.returnValue(mockCurrentUser);
      mockAuthService.isLoggedIn.and.returnValue(true);
      mockAuthService.getPlayerStats.and.returnValue(of(mockPlayerStats));

      component.ngOnInit();

      // Trigger the refresh event
      const refreshEvent = new CustomEvent('refreshNavbarStats');
      window.dispatchEvent(refreshEvent);

      expect(mockAuthService.getPlayerStats).toHaveBeenCalledTimes(2); // Once in ngOnInit, once from event
    });
  });
});
