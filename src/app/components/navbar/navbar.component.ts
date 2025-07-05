import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, PlayerStats } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  playerStats: PlayerStats | null = null;
  currentUser: any = null;
  xpPercentage: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadPlayerStats();

    // Listen for refresh events
    window.addEventListener('refreshNavbarStats', () => {
      this.loadPlayerStats();
    });
  }

  loadPlayerStats(): void {
    if (this.authService.isLoggedIn()) {
      this.authService.getPlayerStats().subscribe({
        next: (stats) => {
          this.playerStats = stats;
          this.calculateXpPercentage();
        },
        error: (error) => {
          console.error('Error loading player stats:', error);
        }
      });
    }
  }

  calculateXpPercentage(): void {
    if (!this.playerStats) return;

    // Calculate XP needed for current level
    const xpNeeded = this.getXpForLevel(this.playerStats.level);
    this.xpPercentage = Math.min(100, (this.playerStats.xp / xpNeeded) * 100);
  }

  getXpForLevel(level: number): number {
    if (level <= 10) {
      return 100 + level * 20;
    }
    return Math.floor(150 + Math.pow(level, 1.5));
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
