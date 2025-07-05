import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GameService, GameData, GameResults } from '../../services/game.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  // Game state
  isConnected = false;
  inQueue = false;
  inGame = false;
  gameFinished = false;
  currentGame: GameData | null = null;
  gameResults: GameResults | null = null;
  queueStatus = '';
  errorMessage = '';

  // Round state
  selectedOption: string | null = null;
  timeRemaining = 15;
  roundTimer: any;
  canAnswer = true;

  // UI state
  showResults = false;

  constructor(
    private gameService: GameService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.setupGameSubscriptions();
    this.connectToGameServer();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.gameService.disconnect();
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
    }
  }

  private setupGameSubscriptions(): void {
    this.subscriptions.push(
      this.gameService.connected$.subscribe((connected) => {
        this.isConnected = connected;
      }),
    );

    this.subscriptions.push(
      this.gameService.queueStatus$.subscribe((status) => {
        this.queueStatus = status;
        this.inQueue = status.includes('Looking for opponent');
      }),
    );

    this.subscriptions.push(
      this.gameService.gameStarted$.subscribe((gameData) => {
        console.log('Game started with data:', gameData);
        console.log('Current round flag:', gameData.round?.flag);
        this.currentGame = gameData;
        this.inGame = true;
        this.inQueue = false;
        this.gameFinished = false;
        this.showResults = false;
        this.startRound();
      }),
    );

    this.subscriptions.push(
      this.gameService.nextRound$.subscribe((gameData) => {
        console.log('Next round data:', gameData);
        console.log('Next round flag:', gameData.round?.flag);
        this.currentGame = gameData;
        this.startRound();
      }),
    );

    this.subscriptions.push(
      this.gameService.gameFinished$.subscribe((results) => {
        this.gameResults = results;
        this.inGame = false;
        this.gameFinished = true;
        this.showResults = true;
        this.stopRoundTimer();

        // Trigger navbar refresh for updated stats
        this.refreshNavbarStats();
      }),
    );

    this.subscriptions.push(
      this.gameService.error$.subscribe((error) => {
        this.errorMessage = error;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }),
    );
  }

  private connectToGameServer(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.gameService.connect(token);
  }

  joinQueue(): void {
    this.gameService.joinQueue();
  }

  leaveQueue(): void {
    this.gameService.leaveQueue();
    this.inQueue = false;
    this.queueStatus = '';
  }

  selectOption(option: string): void {
    if (!this.canAnswer || this.selectedOption) {
      return;
    }

    this.selectedOption = option;
    this.canAnswer = false;
    this.gameService.submitAnswer(option);
  }

  private startRound(): void {
    this.selectedOption = null;
    this.canAnswer = true;
    this.timeRemaining = this.currentGame?.round.timeLimit || 15;
    this.startRoundTimer();
  }

  private startRoundTimer(): void {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
    }

    this.roundTimer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.stopRoundTimer();
        if (this.canAnswer) {
          // Auto-submit empty answer if time runs out
          this.canAnswer = false;
          this.gameService.submitAnswer('');
        }
      }
    }, 1000);
  }

  private stopRoundTimer(): void {
    if (this.roundTimer) {
      clearInterval(this.roundTimer);
      this.roundTimer = null;
    }
  }

  playAgain(): void {
    this.gameFinished = false;
    this.showResults = false;
    this.gameResults = null;
    this.currentGame = null;
    this.joinQueue();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  refreshNavbarStats(): void {
    // Dispatch a custom event to refresh navbar stats
    window.dispatchEvent(new CustomEvent('refreshNavbarStats'));
  }

  getOptionClass(option: string): string {
    if (!this.selectedOption) {
      return 'option-button';
    }

    if (option === this.selectedOption) {
      return 'option-button selected';
    }

    return 'option-button disabled';
  }

  getCurrentPlayer(): any {
    if (!this.currentGame) return null;

    const currentUser = this.authService.getCurrentUser();
    return this.currentGame.players.find(p => p.userId === currentUser?.id);
  }

  getOpponent(): any {
    if (!this.currentGame) return null;

    const currentUser = this.authService.getCurrentUser();
    return this.currentGame.players.find(p => p.userId !== currentUser?.id);
  }
}
