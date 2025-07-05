import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

export interface GameData {
  gameId: string;
  players: { userId: string; username: string; score: number }[];
  currentRound: number;
  round: {
    roundNumber: number;
    flag: string;
    country: string;
    options: string[];
    correctAnswer: string;
    timeLimit: number;
  };
}

export interface GameResults {
  gameId: string;
  results: {
    userId: string;
    username: string;
    score: number;
    correctAnswers: number;
    totalAnswers: number;
  }[];
  totalRounds: number;
  completedRounds: number;
}

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private socket: Socket | null = null;
  private gameStartedSubject = new Subject<GameData>();
  private nextRoundSubject = new Subject<GameData>();
  private gameFinishedSubject = new Subject<GameResults>();
  private queueStatusSubject = new Subject<string>();
  private errorSubject = new Subject<string>();
  private connectedSubject = new Subject<boolean>();

  // Observables
  gameStarted$ = this.gameStartedSubject.asObservable();
  nextRound$ = this.nextRoundSubject.asObservable();
  gameFinished$ = this.gameFinishedSubject.asObservable();
  queueStatus$ = this.queueStatusSubject.asObservable();
  error$ = this.errorSubject.asObservable();
  connected$ = this.connectedSubject.asObservable();

  private currentGameId: string | null = null;
  private roundStartTime: number = 0;

  connect(token: string): void {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.socket = io('http://localhost:3000', {
      auth: { token },
    });

    this.setupSocketListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinQueue(): void {
    if (this.socket) {
      this.socket.emit('joinQueue');
    }
  }

  leaveQueue(): void {
    if (this.socket) {
      this.socket.emit('leaveQueue');
    }
  }

  submitAnswer(selectedOption: string): void {
    if (this.socket && this.currentGameId) {
      const timeToAnswer = (Date.now() - this.roundStartTime) / 1000; // Convert to seconds
      this.socket.emit('submitAnswer', {
        gameId: this.currentGameId,
        selectedOption,
        timeToAnswer,
      });
    }
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to game server');
      this.connectedSubject.next(true);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from game server');
      this.connectedSubject.next(false);
    });

    this.socket.on('connected', (data) => {
      console.log('Game server connection confirmed:', data.message);
    });

    this.socket.on('queueJoined', (data) => {
      console.log('Queue joined:', data.message);
      this.queueStatusSubject.next(data.message);
    });

    this.socket.on('queueLeft', (data) => {
      console.log('Queue left:', data.message);
      this.queueStatusSubject.next(data.message);
    });

    this.socket.on('gameStarted', (data: GameData) => {
      console.log('Game started:', data);
      this.currentGameId = data.gameId;
      this.roundStartTime = Date.now();
      this.gameStartedSubject.next(data);
    });

    this.socket.on('nextRound', (data: GameData) => {
      console.log('Next round:', data);
      this.roundStartTime = Date.now();
      this.nextRoundSubject.next(data);
    });

    this.socket.on('gameFinished', (data: GameResults) => {
      console.log('Game finished:', data);
      this.currentGameId = null;
      this.gameFinishedSubject.next(data);
    });

    this.socket.on('answerSubmitted', (data) => {
      console.log('Answer submitted:', data.message);
    });

    this.socket.on('error', (data) => {
      console.error('Game error:', data.message);
      this.errorSubject.next(data.message);
    });
  }

  getCurrentGameId(): string | null {
    return this.currentGameId;
  }

  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }
}
