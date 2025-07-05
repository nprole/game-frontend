import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'game-frontend';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  shouldShowNavbar(): boolean {
    const currentUrl = this.router.url;
    const publicRoutes = ['/login', '/register'];

    return !publicRoutes.includes(currentUrl) && this.authService.isLoggedIn();
  }
}
