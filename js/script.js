var app = new Vue(
    {
        el: '#root',
        data: {
            searchQuery: "",
            movies: [],
            series: [],
            popularMovies: [],
            popularSeries: [],
            flags: ["it", "en", "es", "fr", "de", "ja", "zh", "ko"],
            genresMovies: [],
            genresSeries: [],
            selectedMovieGenre: "selectedMovie",
            selectedSerieGenre: "selectedSerie",
            renderMessage: false,
        },
        methods: {
            // funcion para importar imagenes de API
            getImages: function(element) {
                if(element.poster_path != null) {
                    return 'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + element.poster_path;
                }

                return 'img/noHayGetflix.png';
            },
            // función para obtener voto/estrellas
            getVote: function(element) {

                return Math.ceil(element / 2);

            },
            // función para la lista de peliculas
            getMovies: function() {

                //llamada de API movie
                axios
                .get('https://api.themoviedb.org/3/search/movie', {
                    params: {
                        api_key: "675f320afc5f42390cf425e86877cb84",
                        query: this.searchQuery,
                        language: "es-ES",
                    }
                })
                .then((movie)=> {

                    this.movies = movie.data.results;

                    for (let i = 0; i < this.movies.length; i++) {

                        this.movies[i].castList = [];

                        //llamda de API de peliculas
                        axios
                        .get("https://api.themoviedb.org/3/movie/" + this.movies[i].id + "/credits", {
                            params: {
                                api_key: "675f320afc5f42390cf425e86877cb84",
                                language: "es-ES",
                            }
                        })
                        .then((element)=> {

                            for(let j = 0; j < element.data.cast.length; j++) {
                                if(this.movies[i].castList.length < 5) {
                                    this.movies[i].castList.push(element.data.cast[j].name);
                                }
                            }
                            
                            this.$forceUpdate();
                        });

                        //asignación de genero de pelicula
                        for(let j = 0; j < this.movies[i].genre_ids.length; j++) {
                            
                            for(let k = 0; k < this.genresMovies.length; k++) {
                                if(this.movies[i].genre_ids[j] == this.genresMovies[k].id) {
                                    this.movies[i].genre_ids[j] = this.genresMovies[k].name;
                                }
                            }
                           
                        }
                        this.$forceUpdate();

                    } 

                });
            },
            //funcion para la serie de tv
            getSeries: function() {

                //llamada de API serie tv
                axios
                .get('https://api.themoviedb.org/3/search/tv', {
                    params: {
                        api_key: "675f320afc5f42390cf425e86877cb84",
                        query: this.searchQuery,
                        language: "es-ES",
                    }
                })
                .then((serie)=> {

                    this.series = serie.data.results;

                    for (let i = 0; i < this.series.length; i++) {

                        this.series[i].castList = [];

                        //llamada de API serie tv 
                        axios
                        .get("https://api.themoviedb.org/3/tv/" + this.series[i].id + "/credits", {
                            params: {
                                api_key: "675f320afc5f42390cf425e86877cb84",
                                language: "es-ES",
                            }
                        })
                        .then((element)=> {

                          
                            for(let j = 0; j < element.data.cast.length; j++) {
                                if(this.series[i].castList.length < 5) {
                                    this.series[i].castList.push(element.data.cast[j].name);
                                }
                            }
                            
                            this.$forceUpdate();
                        });

                        //asignacion de genero de tv
                        for(let j = 0; j < this.series[i].genre_ids.length; j++) {
                            
                            for(let k = 0; k < this.genresSeries.length; k++) {
                                if(this.series[i].genre_ids[j] == this.genresSeries[k].id) {
                                    this.series[i].genre_ids[j] = this.genresSeries[k].name;
                                }
                            }
                            
                        }
                        this.$forceUpdate();
                    }

                });

            },
              // funcion para ejecutar la busqueda
            getTitles: function() {
                
                if(this.searchQuery != "") {
                    this.getMovies();
                    this.getSeries();
                    
                    this.searchQuery = "";
                    this.selectedMovieGenre = "selectedMovie";
                    this.selectedSerieGenre = "selectedSerie";
                    this.renderMessage = true;
                }
                
            },
        }, 
        mounted: function() {

            // llamada de genero de peliculas
            axios
            .get('https://api.themoviedb.org/3/genre/movie/list', {
                params: {
                    api_key: "675f320afc5f42390cf425e86877cb84",
                    language: "es-ES",
                }
            })
            .then((element)=> {

                this.genresMovies = element.data.genres;

            });
            

            // llamada de genero de serieTv
            axios
            .get('https://api.themoviedb.org/3/genre/tv/list', {
                params: {
                    api_key: "675f320afc5f42390cf425e86877cb84",
                    language: "es-ES",
                }
            })
            .then((element)=> {

                this.genresSeries = element.data.genres;

            });

            // llamada de peliculas populares
            axios
            .get('https://api.themoviedb.org/3/movie/popular', {
                params: {
                    api_key: "675f320afc5f42390cf425e86877cb84",
                    language: "es-ES",
                }
            })
            .then((element)=> {

                for(let k = 0; k < 5; k++) {
                    this.popularMovies.push(element.data.results[k])
                }
                
                for (let i = 0; i < this.popularMovies.length; i++) {

                    this.popularMovies[i].castList = [];

                    //llamada de peliculas populares 
                    axios
                    .get("https://api.themoviedb.org/3/movie/" + this.popularMovies[i].id + "/credits", {
                        params: {
                            api_key: "675f320afc5f42390cf425e86877cb84",
                            language: "es-ES",
                        }
                    })
                    .then((element)=> {

                        for(let j = 0; j < element.data.cast.length; j++) {
                            if(this.popularMovies[i].castList.length < 5) {
                                this.popularMovies[i].castList.push(element.data.cast[j].name);
                            }
                        }
                        
                        this.$forceUpdate();
                    });

                    //asignación de genero para peliculas populares 
                    for(let j = 0; j < this.popularMovies[i].genre_ids.length; j++) {
                            
                        for(let k = 0; k < this.genresMovies.length; k++) {
                            if(this.popularMovies[i].genre_ids[j] == this.genresMovies[k].id) {
                                this.popularMovies[i].genre_ids[j] = this.genresMovies[k].name;
                            }
                        }
                      
                    }
                    this.$forceUpdate();
                }

            });

            // llamada de serieTv populares
            axios
            .get('https://api.themoviedb.org/3/tv/popular', {
                params: {
                    api_key: "675f320afc5f42390cf425e86877cb84",
                    language: "es-ES",
                }
            })
            .then((element)=> {

                for(let k = 0; k < 5; k++) {
                    this.popularSeries.push(element.data.results[k])
                }
                
                for (let i = 0; i < this.popularSeries.length; i++) {

                    this.popularSeries[i].castList = [];

                    //llamada de API serieTv populares
                    axios
                    .get("https://api.themoviedb.org/3/tv/" + this.popularSeries[i].id + "/credits", {
                        params: {
                            api_key: "675f320afc5f42390cf425e86877cb84",
                            language: "es-ES",
                        }
                    })
                    .then((element)=> {

                        
                        for(let j = 0; j < element.data.cast.length; j++) {
                            if(this.popularSeries[i].castList.length < 5) {
                                this.popularSeries[i].castList.push(element.data.cast[j].name);
                            }
                        }
                        
                        this.$forceUpdate();
                    });

                    //asignación de genero de serie tv populares
                    for(let j = 0; j < this.popularSeries[i].genre_ids.length; j++) {

                        for(let k = 0; k < this.genresSeries.length; k++) {         
                            if(this.popularSeries[i].genre_ids[j] == this.genresSeries[k].id) {
                                this.popularSeries[i].genre_ids[j] = this.genresSeries[k].name;
                            }
                        }

                    }
                    this.$forceUpdate();
                }

            });

        }
    }
);

