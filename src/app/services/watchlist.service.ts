import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Movie, TVSeries } from '../models/movie.models';

export interface WatchlistItem {
  id: number;
  type: 'movie' | 'tv';
  title: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  addedAt: number;
}

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private readonly STORAGE_KEY = 'netflix_watchlist';
  private watchlistSubject = new BehaviorSubject<WatchlistItem[]>([]);
  public watchlist$ = this.watchlistSubject.asObservable();

  constructor() {
    this.loadWatchlist();
  }

  private loadWatchlist(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        const items = JSON.parse(stored);
        this.watchlistSubject.next(items);
      } catch (e) {
        console.error('Error loading watchlist:', e);
        this.watchlistSubject.next([]);
      }
    }
  }

  private saveWatchlist(items: WatchlistItem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    this.watchlistSubject.next(items);
  }

  addToWatchlist(item: Movie | TVSeries, type: 'movie' | 'tv'): void {
    const current = this.watchlistSubject.value;
    const exists = current.some(w => w.id === item.id && w.type === type);
    
    if (!exists) {
      const watchlistItem: WatchlistItem = {
        id: item.id,
        type,
        title: (item as any).title || (item as any).name,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        addedAt: Date.now()
      };
      this.saveWatchlist([...current, watchlistItem]);
    }
  }

  removeFromWatchlist(id: number, type: 'movie' | 'tv'): void {
    const current = this.watchlistSubject.value;
    const filtered = current.filter(w => !(w.id === id && w.type === type));
    this.saveWatchlist(filtered);
  }

  isInWatchlist(id: number, type: 'movie' | 'tv'): boolean {
    return this.watchlistSubject.value.some(w => w.id === id && w.type === type);
  }

  getWatchlist(): WatchlistItem[] {
    return this.watchlistSubject.value;
  }

  clearWatchlist(): void {
    this.saveWatchlist([]);
  }
}
