import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaderboardService, LeaderboardEntry } from '../../services/leaderboard.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  leaderboard: LeaderboardEntry[] = [];
  loading = true;
  error = false;

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.loadLeaderboard();
  }

  loadLeaderboard(): void {
    this.loading = true;
    this.error = false;

    this.leaderboardService.getLeaderboard().subscribe({
      next: (data) => {
        this.leaderboard = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading leaderboard:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getRankClass(rank: number): string {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-normal';
  }

  getRankIcon(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank.toString();
  }

  // Helper methods for podium data
  getPodiumAvatar(index: number): string {
    const entry = this.leaderboard[index];
    if (!entry?.username) return '?';
    return entry.username.charAt(0).toUpperCase();
  }

  getPodiumUsername(index: number): string {
    const entry = this.leaderboard[index];
    return entry?.username || 'Unknown';
  }

  getPodiumLevel(index: number): number {
    const entry = this.leaderboard[index];
    return entry?.level || 0;
  }

  getPodiumExperience(index: number): number {
    const entry = this.leaderboard[index];
    return entry?.experience || 0;
  }

  // Helper methods for table data
  getPlayerAvatar(entry: LeaderboardEntry): string {
    return entry?.username?.charAt(0).toUpperCase() || '?';
  }

  getPlayerName(entry: LeaderboardEntry): string {
    return entry?.username || 'Unknown';
  }
}
