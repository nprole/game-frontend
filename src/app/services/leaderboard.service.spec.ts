import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LeaderboardService, LeaderboardEntry } from './leaderboard.service';

describe('LeaderboardService', () => {
  let service: LeaderboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaderboardService],
    });
    service = TestBed.inject(LeaderboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch leaderboard data from API', () => {
    const mockData: LeaderboardEntry[] = [
      { rank: 1, username: 'A', level: 10, experience: 1000 },
      { rank: 2, username: 'B', level: 9, experience: 900 },
    ];

    service.getLeaderboard().subscribe(data => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne('http://localhost:3000/auth/leaderboard');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
