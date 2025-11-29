import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonIcon,
  IonSearchbar,
  IonButton,
  IonSpinner,
  ModalController,
  LoadingController
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { WatchlistService } from '../services/watchlist.service';
import { MovieDetailModalComponent } from '../components/movie-detail-modal/movie-detail-modal.component';
import { Movie, TVSeries } from '../models/movie.models';
import { addIcons } from 'ionicons';
import { search, heart, heartOutline, tv, person, film } from 'ionicons/icons';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonIcon,
    IonSearchbar,
    IonButton,
    IonSpinner
  ],
})
export class Tab3Page implements OnInit {
  searchQuery: string = '';
  searchResults: (Movie | TVSeries)[] = [];
  isSearching: boolean = false;
  hasSearched: boolean = false;

  private movieService = inject(MovieService);
  private watchlistService = inject(WatchlistService);
  private modalController = inject(ModalController);
  private loadingController = inject(LoadingController);

  constructor() {
    addIcons({ search, heart, heartOutline, tv, person, film });
  }

  ngOnInit(): void {}

  async onSearchChange(event: any): Promise<void> {
    this.searchQuery = event.detail.value;
    
    if (this.searchQuery.trim().length === 0) {
      this.searchResults = [];
      this.hasSearched = false;
      return;
    }

    this.isSearching = true;
    this.hasSearched = true;

    try {
      const results = await this.movieService.searchMulti(this.searchQuery).toPromise();
      this.searchResults = results || [];
    } catch (error) {
      console.error('Erro ao buscar:', error);
      this.searchResults = [];
    } finally {
      this.isSearching = false;
    }
  }

  async openMovieDetail(item: Movie | TVSeries): Promise<void> {
    const mediaType = (item as any).media_type || 'movie';
    const modal = await this.modalController.create({
      component: MovieDetailModalComponent,
      componentProps: {
        movieId: item.id,
        mediaType: mediaType
      },
      cssClass: 'movie-detail-modal'
    });
    return await modal.present();
  }

  isInWatchlist(movieId: number, type: 'movie' | 'tv' = 'movie'): boolean {
    return this.watchlistService.isInWatchlist(movieId, type);
  }

  toggleWatchlist(item: Movie | TVSeries, event: Event, type: 'movie' | 'tv' = 'movie'): void {
    event.stopPropagation();
    if (this.isInWatchlist(item.id, type)) {
      this.watchlistService.removeFromWatchlist(item.id, type);
    } else {
      this.watchlistService.addToWatchlist(item, type);
    }
  }

  getMediaTypeLabel(item: Movie | TVSeries): string {
    const mediaType = (item as any).media_type;
    if (mediaType === 'tv') return '📺 Série';
    if (mediaType === 'person') return '👤 Pessoa';
    return '🎬 Filme';
  }

  getMediaTypeIcon(item: Movie | TVSeries): string {
    const mediaType = (item as any).media_type;
    if (mediaType === 'tv') return 'tv';
    if (mediaType === 'person') return 'person';
    return 'film';
  }

  getMediaType(item: Movie | TVSeries): 'movie' | 'tv' {
    return (item as any).media_type === 'tv' ? 'tv' : 'movie';
  }

  isItemInWatchlist(item: Movie | TVSeries): boolean {
    const type = this.getMediaType(item);
    return this.isInWatchlist(item.id, type);
  }

  getItemTitle(item: Movie | TVSeries): string {
    return (item as any).title || (item as any).name || 'Sem título';
  }

  isNotPerson(item: Movie | TVSeries): boolean {
    return (item as any).media_type !== 'person';
  }
}
