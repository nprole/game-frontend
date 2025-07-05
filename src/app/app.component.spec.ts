import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';

describe('AppComponent', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'getCurrentUser',
      'getPlayerStats',
      'login',
      'register',
      'setToken',
      'getToken',
      'setCurrentUser',
      'logout'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], { url: '/dashboard' });

    await TestBed.configureTestingModule({
      imports: [AppComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'game-frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('game-frontend');
  });

  it('should show navbar when user is logged in and not on public routes', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    Object.defineProperty(mockRouter, 'url', { value: '/dashboard' });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.shouldShowNavbar()).toBe(true);
  });

  it('should hide navbar on login page', () => {
    mockAuthService.isLoggedIn.and.returnValue(true);
    Object.defineProperty(mockRouter, 'url', { value: '/login' });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.shouldShowNavbar()).toBe(false);
  });

  it('should hide navbar when user is not logged in', () => {
    mockAuthService.isLoggedIn.and.returnValue(false);
    Object.defineProperty(mockRouter, 'url', { value: '/dashboard' });

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    expect(app.shouldShowNavbar()).toBe(false);
  });
});
