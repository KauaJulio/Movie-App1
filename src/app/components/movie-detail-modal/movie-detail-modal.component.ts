import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSpinner,
  ModalController,
  IonButtons
} from '@ionic/angular/standalone';
import { MovieService } from '../../services/movie.service';
import { WatchlistService } from '../../services/watchlist.service';
import { Movie, MovieDetails, TVSeries } from '../../models/movie.models';
import { addIcons } from 'ionicons';
import { play, heart, heartOutline, share, close } from 'ionicons/icons';

@Component({
  selector: 'app-movie-detail-modal',
  templateUrl: './movie-detail-modal.component.html',
  styleUrls: ['./movie-detail-modal.component.scss'],
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSpinner,
    IonButtons
  ]
})
export class MovieDetailModalComponent implements OnInit {
  movieDetails: MovieDetails | TVSeries | null = null;
  isLoading = true;
  isFavorite = false;
  movieId!: number;
  mediaType: 'movie' | 'tv' = 'movie';

  private movieService = inject(MovieService);
  private watchlistService = inject(WatchlistService);
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ play, heart, heartOutline, share, close });
  }

  ngOnInit(): void {
    this.loadDetails();
  }

  private loadDetails(): void {
    if (this.mediaType === 'movie') {
      this.movieService.getMovieDetails(this.movieId).subscribe({
        next: (details) => {
          this.movieDetails = details;
          this.isFavorite = this.watchlistService.isInWatchlist(this.movieId, 'movie');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao carregar detalhes do filme:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.movieService.getTVSeriesDetails(this.movieId).subscribe({
        next: (details) => {
          this.movieDetails = details as any;
          this.isFavorite = this.watchlistService.isInWatchlist(this.movieId, 'tv');
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro de carregamento no detalhes:', err);
          this.isLoading = false;
        }
      });
    }
  }

  toggleFavorite(): void {
    if (this.isFavorite) {
      this.watchlistService.removeFromWatchlist(this.movieId, this.mediaType);
    } else {
      this.watchlistService.addToWatchlist(this.movieDetails as any, this.mediaType);
    }
    this.isFavorite = !this.isFavorite;
  }

  close(): void {
    this.modalController.dismiss();
  }

  getGenreNames(): string {
    const details = this.movieDetails as any;
    if (!details?.genres) return 'N/A';
    return details.genres.map((g: any) => g.name).join(', ');
  }

  getMainCast(): string {
    const details = this.movieDetails as any;
    if (!details?.credits?.cast || details.credits.cast.length === 0) {
      return 'N/A';
    }
    return details.credits.cast
      .slice(0, 3)
      .map((c: any) => c.name)
      .join(', ');
  }

  getDirector(): string {
    const details = this.movieDetails as any;
    if (!details?.credits?.crew) return 'N/A';
    const director = details.credits.crew.find((c: any) => c.job === 'Director');
    return director?.name || 'N/A';
  }

  formatRuntime(minutes?: number): string {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR');
  }

  getRatingColor(rating: number): string {
    if (rating >= 8) return 'success';
    if (rating >= 6) return 'warning';
    return 'danger';
  }

  getTitle(): string {
    return (this.movieDetails as any)?.title || '';
  }

  getOverview(): string {
    return (this.movieDetails as any)?.overview || '';
  }

  getReleaseDate(): string {
    return (this.movieDetails as any)?.release_date || (this.movieDetails as any)?.first_air_date || '';
  }

  getRuntime(): number | undefined {
    return (this.movieDetails as any)?.runtime;
  }

  getCredits(): any {
    return (this.movieDetails as any)?.credits;
  }

  hasCredits(): boolean {
    const credits = this.getCredits();
    return credits && credits.cast && credits.cast.length > 0;
  }

  getCastList(): any[] {
    const credits = this.getCredits();
    return credits?.cast?.slice(0, 6) || [];
  }
}
