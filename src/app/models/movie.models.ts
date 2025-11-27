export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    vote_count: number;
    popularity: number;
    original_language: string;
    original_title: string;
    genre_ids: number[];
    adult: boolean;
    video: boolean;
    media_type?: string;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetails extends Movie {
    runtime?: number;
    budget?: number;
    revenue?: number;
    status?: string;
    tagline?: string;
    genres?: Genre[];
    production_companies?: ProductionCompany[];
    credits?: Credits;
}

export interface Genre {
    id: number;
    name: string;
}

export interface ProductionCompany {
    id: number;
    name: string;
    logo_path?: string;
    origin_country?: string;
}

export interface Credits {
    cast?: CastMember[];
    crew?: CrewMember[];
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path?: string;
    order: number;
}

export interface CrewMember {
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path?: string;
}

export interface TVSeries extends Movie {
    name?: string;
    first_air_date?: string;
    last_air_date?: string;
    number_of_seasons?: number;
    number_of_episodes?: number;
    networks?: Network[];
}

export interface Network {
    id: number;
    name: string;
    logo_path?: string;
    origin_country?: string;
}

export interface GenreList {
    genres: Genre[];
}
