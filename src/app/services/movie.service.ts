import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Movie, MovieResponse, MovieDetails, TVSeries, GenreList } from '../models/movie.models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private httpClient: HttpClient = inject(HttpClient);

  // Movies
  getMovies(): Observable<Movie[]> {
    const url: string = `${environment.api}/3/movie/now_playing?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  getTrendingMovies(): Observable<Movie[]> {
    const url: string = `${environment.api}/3/trending/movie/week?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  getPopularMovies(): Observable<Movie[]> {
    const url: string = `${environment.api}/3/movie/popular?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  getTopRatedMovies(): Observable<Movie[]> {
    const url: string = `${environment.api}/3/movie/top_rated?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  getUpcomingMovies(): Observable<Movie[]> {
    const url: string = `${environment.api}/3/movie/upcoming?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const url: string = `${environment.api}/3/movie/${movieId}?language=pt-br&append_to_response=credits`;
    return this.httpClient.get<MovieDetails>(url);
  }

  // TV Series
  getTrendingTVSeries(): Observable<TVSeries[]> {
    const url: string = `${environment.api}/3/trending/tv/week?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results as TVSeries[])
    );
  }

  getPopularTVSeries(): Observable<TVSeries[]> {
    const url: string = `${environment.api}/3/tv/popular?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results as TVSeries[])
    );
  }

  getTopRatedTVSeries(): Observable<TVSeries[]> {
    const url: string = `${environment.api}/3/tv/top_rated?language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results as TVSeries[])
    );
  }

  getTVSeriesDetails(seriesId: number): Observable<TVSeries> {
    const url: string = `${environment.api}/3/tv/${seriesId}?language=pt-br&append_to_response=credits`;
    return this.httpClient.get<TVSeries>(url);
  }

  // Search
  searchMovies(query: string): Observable<Movie[]> {
    const url: string = `${environment.api}/3/search/movie?query=${encodeURIComponent(query)}&language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  searchTVSeries(query: string): Observable<TVSeries[]> {
    const url: string = `${environment.api}/3/search/tv?query=${encodeURIComponent(query)}&language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results as TVSeries[])
    );
  }

  searchMulti(query: string): Observable<(Movie | TVSeries)[]> {
    const url: string = `${environment.api}/3/search/multi?query=${encodeURIComponent(query)}&language=pt-br`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  // Genres
  getMovieGenres(): Observable<GenreList> {
    const url: string = `${environment.api}/3/genre/movie/list?language=pt-br`;
    return this.httpClient.get<GenreList>(url);
  }

  getTVGenres(): Observable<GenreList> {
    const url: string = `${environment.api}/3/genre/tv/list?language=pt-br`;
    return this.httpClient.get<GenreList>(url);
  }

  // Discover
  discoverMoviesByGenre(genreId: number): Observable<Movie[]> {
    const url: string = `${environment.api}/3/discover/movie?with_genres=${genreId}&language=pt-br&sort_by=popularity.desc`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results)
    );
  }

  discoverTVByGenre(genreId: number): Observable<TVSeries[]> {
    const url: string = `${environment.api}/3/discover/tv?with_genres=${genreId}&language=pt-br&sort_by=popularity.desc`;
    return this.httpClient.get<MovieResponse>(url).pipe(
      map(response => response.results as TVSeries[])
    );
  }
}
