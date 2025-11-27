import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonImg,
  LoadingController,
  ModalController,
  IonButton,
  IonIcon,
  IonSpinner
} from '@ionic/angular/standalone';
import ColorThief from 'colorthief';
import { Movie } from '../models/movie.models';
import { MovieService } from '../services/movie.service';
import { WatchlistService } from '../services/watchlist.service';
import { UtilsHelper } from '../utils/utils.helper';
import { MovieDetailModalComponent } from '../components/movie-detail-modal/movie-detail-modal.component';
import { addIcons } from 'ionicons';
import { play, heart, heartOutline, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    CommonModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonImg,
    IonButton,
    IonIcon,
    IonSpinner
  ],
})
export class Tab1Page implements AfterViewInit, OnInit {
  backgroundColor: string = 'rgb(0, 0, 0)';
  
  nowPlayingMovies?: Movie[];
  trendingMovies?: Movie[];
  popularMovies?: Movie[];
  topRatedMovies?: Movie[];
  highlightMovie?: Movie;

  private startScrollPoint = 0;
  private initialColor = [0, 0, 0];

  darkModeEnable: boolean = true;
  isLoading = true;

  @ViewChild('posterImage') posterImage!: ElementRef<HTMLImageElement>;

  private movieService: MovieService = inject(MovieService);
  private watchlistService: WatchlistService = inject(WatchlistService);
  private loadingController = inject(LoadingController);
  private modalController = inject(ModalController);

  constructor() {
    addIcons({ play, heart, heartOutline, informationCircle });
  }

  ngOnInit(): void {
    this.toggleDarkMode();
  }

  ngAfterViewInit(): void {
    this.loadAllMovies();
  }

  onScroll(event: any): void {
    this.updateBackgroundColor(event.detail.scrollTop);
  }

  async loadAllMovies(refresher?: any) {
    const loading = await this.loadingController.create();
    
    if (!refresher) {
      await loading.present();
    }

    this.isLoading = true;

    // Load all categories in parallel
    Promise.all([
      this.movieService.getMovies().toPromise(),
      this.movieService.getTrendingMovies().toPromise(),
      this.movieService.getPopularMovies().toPromise(),
      this.movieService.getTopRatedMovies().toPromise()
    ]).then(([nowPlaying, trending, popular, topRated]) => {
      this.nowPlayingMovies = nowPlaying;
      this.trendingMovies = trending;
      this.popularMovies = popular;
      this.topRatedMovies = topRated;

      // Set highlight movie from now playing
      if (this.nowPlayingMovies && this.nowPlayingMovies.length > 0) {
        const randomIndex = Math.floor(Math.random() * this.nowPlayingMovies.length);
        this.highlightMovie = this.nowPlayingMovies[randomIndex];
        this.initializeImage();
      }

      this.isLoading = false;
      this.completeLoading(loading, refresher);
    }).catch((error) => {
      console.error('Error loading movies:', error);
      this.isLoading = false;
      this.completeLoading(loading, refresher);
    });
  }

  private initializeImage(): void {
    if (!this.posterImage) return;
    const img = this.posterImage.nativeElement;
    img.onload = () => {
      this.startScrollPoint = img.offsetHeight / 2;
      this.extractColors(img);
    }
    img.src = `https://image.tmdb.org/t/p/w500/${this.highlightMovie?.backdrop_path}`;
  }
  
  private extractColors(img: HTMLImageElement) {
    const colorThief = new ColorThief();
    const rgbColors = colorThief.getColor(img);
    this.initialColor = rgbColors;
    this.backgroundColor = `rgb(${rgbColors.join(',')})`;
  }

  private updateBackgroundColor(scrollTop: number): void {
    if (scrollTop < this.startScrollPoint) {
      this.backgroundColor = `rgb(${this.initialColor.join(', ')})`;
      return;
    }

    const maxTransitionScroll = 300;
    const distanceScrolled = scrollTop - this.startScrollPoint;
    const progress = Math.min(distanceScrolled / maxTransitionScroll, 1);

    const finalColor = [0, 0, 0];
    const interpolateColor = UtilsHelper.interpolateColor(this.initialColor, finalColor, progress);
    this.backgroundColor = `rgb(${interpolateColor.join(', ')})`;
  }

  toggleDarkMode(): void {
    document.documentElement.classList.toggle('ion-palette-dark', this.darkModeEnable);
  }

  async openMovieDetail(movie: Movie, mediaType: 'movie' | 'tv' = 'movie'): Promise<void> {
    const modal = await this.modalController.create({
      component: MovieDetailModalComponent,
      componentProps: {
        movieId: movie.id,
        mediaType: mediaType
      },
      cssClass: 'movie-detail-modal'
    });
    return await modal.present();
  }

  isInWatchlist(movieId: number, type: 'movie' | 'tv' = 'movie'): boolean {
    return this.watchlistService.isInWatchlist(movieId, type);
  }

  toggleWatchlist(movie: Movie, event: Event, type: 'movie' | 'tv' = 'movie'): void {
    event.stopPropagation();
    if (this.isInWatchlist(movie.id, type)) {
      this.watchlistService.removeFromWatchlist(movie.id, type);
    } else {
      this.watchlistService.addToWatchlist(movie, type);
    }
  }

  private completeLoading(loading?: HTMLIonLoadingElement, refresher?: any) {
    loading?.dismiss();
    refresher?.target.complete();
  }
}
