import { Card, CardContent, GridList, GridListTile, GridListTileBar,Button, FormControl, InputLabel, Input, Select, MenuItem, 
    Checkbox, TextField, Typography } from "@material-ui/core";
import React from "react";
import "./Home.css";
import { useHistory } from "react-router-dom";
import Header from "../../common/header/Header";
import { makeStyles } from '@material-ui/core/styles';


// JSS styles for the filter card
const useStyles = makeStyles((theme) => ({
    title: {
        color: theme.palette.primary.light,
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240,
    },
    form: {
        margin: theme.spacing.unit,
        minWidth: 240,
        maxWidth: 240,
    }
}));


function Home(props) {
    // States
    const [upcomingMoviesList, setUpcomingMoviesList] = React.useState([]);
    const [releasedMoviesList, setReleasedMoviesList] = React.useState([]);
    const [genresList, setGenresList] = React.useState([]);
    const [artistsList, setArtistsList] = React.useState([]);
    // Filter states
    const [genresFilter, setGenresFilter] = React.useState({});
    const [artistsFilter, setArtistsFilter] = React.useState({});
    const [movieNameFilter, setMovieNameFilter] = React.useState("");
    const [releaseStartDateFilter, setReleaseStartDateFilter] = React.useState("dd-mm-yyyy");
    const [releaseEndDateFilter, setReleaseEndDateFilter] = React.useState("dd-mm-yyyy");
    const [releasedMoviesFilter, setReleasedMoviesFilter] = React.useState([]);
    // Filter input labels
    const [genreLabel, setGenreLabel] = React.useState("");
    const [artistLabel, setArtistLabel] = React.useState("");
    const history = useHistory();
    const classes = useStyles();

    React.useEffect(() => {
        loadImages();
        loadGenres();
        loadArtists();
    }, []);

    const loadImages = async () => {
        // Load all upcoming and relased movies images
        const rawResponse = await fetch(props.baseUrl + "movies?page=1&limit=17", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: `Bearer ${window.sessionStorage.getItem("access-token")}`
            }
        });
        const result = await rawResponse.json();
        const data = result.movies;

        // upcoming movies filter
        const publishedFilter = data.filter((movie) => {
            return movie.status === "PUBLISHED";
        })
        setUpcomingMoviesList(publishedFilter);

        // Released movies filter
        const filteredMovies = data.filter((movie) => {
            return movie.status === "RELEASED";
        }) 
        setReleasedMoviesList(filteredMovies);
        setReleasedMoviesFilter(filteredMovies);
    }

    const loadGenres = async () => {
        // Load all the genres for filtering
        const rawResponse = await fetch(props.baseUrl + "/genres", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: `Bearer ${window.sessionStorage.getItem("access-token")}`
            }
        });
        const result = await rawResponse.json();
        const data = result.genres;
        setGenresList(data);

        // Genres checkboxes initial state
        const initialGenreState = {};
        data.forEach((genre) => {
            initialGenreState[genre.genre] = false;
        })
        setGenresFilter({...initialGenreState});
    }

    const loadArtists = async () => {
        // Get all artists
        const rawResponse = await fetch(props.baseUrl + "artists?page=1&limit=20", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Bearer " + sessionStorage.getItem("access-token")
            }
        });
        const result = await rawResponse.json();
        const data = result.artists;
        setArtistsList(data);

        // Artists checkboxes initial state
        const initialArtistsState = {};
        data.forEach((artist) => {
            initialArtistsState[`${artist.first_name}_${artist.last_name}`] = false;
        })
        setArtistsFilter({...initialArtistsState});
    }

    const genreFilterChangedHandler = (event) => {
        // Update genres filter checkboxes state
        const updatedGenresFilter = genresFilter;
        updatedGenresFilter[event.target.name] = event.target.checked
        setGenresFilter({...updatedGenresFilter});
        setGenreLabel(event.target.name);
    };

    const artistsFilterChangedHandler = (event) => {
        // Update artists filter checkboxes state
        const updatedArtistsFilter = artistsFilter;
        updatedArtistsFilter[event.target.name] = event.target.checked
        setArtistsFilter({...updatedArtistsFilter});
        setArtistLabel(event.target.name);
    };

    const applyFilterHandler = (event) => {
        // Apply the filter to the released movies list
        const startDate = new Date(releaseStartDateFilter);
        const endDate = new Date(releaseEndDateFilter);

        const filteredMovies = releasedMoviesList.filter((movie) => {
            let filter = false;
            if(movie.title === movieNameFilter){
                filter = true;
            }

            movie.genres.forEach((genre) => {
                if(genresFilter[genre])
                    filter = true;
            })

            movie.artists.forEach((artist) => {
                if(artistsFilter[`${artist.first_name}_${artist.last_name}`])
                    filter = true;
            })

            const movieReleaseDate = new Date(movie.release_date);

            if((movieReleaseDate.getTime() >= startDate.getTime()) && (movieReleaseDate.getTime() <= endDate.getTime()))
                filter = true;
            
            return filter;
        })

        // If filter is applied use the filtered list else use the origin released movies list
        if(filteredMovies.length === 0)
            setReleasedMoviesFilter(releasedMoviesList);
        else
            setReleasedMoviesFilter(filteredMovies);
    }

    const showMovieDetailsHandler = (id) => {
        // Go to the details page for the movie
        history.push("/movie/" + id);
    }

    return (
        <React.Fragment>
            <Header baseUrl={props.baseUrl} showBookingButton={false}/>
            {/* Upcoming movies section*/}
            <h3 className="homepage-header">Upcoming Movies</h3>
            <GridList cellHeight={250} cols={6} className="carousel">
                {
                    upcomingMoviesList.map(movie => {
                        return (
                            <GridListTile key={movie.id}>
                                <img src={movie.poster_url} alt={movie.title} />
                                <GridListTileBar title={movie.title} />
                            </GridListTile>
                        );
                    })
                }
            </GridList>
            {/* Released movies section */}
            <div className="released-movies">
                {/* Movies grid */}
                <div className="movies-grid">
                    <GridList cellHeight={350} cols={4} >
                        {
                            releasedMoviesFilter.map(movie => {
                                return (
                                    <GridListTile key={movie.id} className="released-movies-card" onClick={() => showMovieDetailsHandler(movie.id)}>
                                        <img src={movie.poster_url} alt={movie.title} />
                                        <GridListTileBar title={movie.title} subtitle={`Released Date - ${new Date(movie.release_date).toDateString()}`}/>
                                    </GridListTile>
                                );
                            })
                        }
                    </GridList>
                </div>
                {/* Filter card */}
                <div className="filter-card">
                    <Card> 
                        <CardContent>
                            <Typography className={classes.title}>FIND MOVIES BY:</Typography>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="moviename">Movie Name</InputLabel>
                                <Input id="moviename" type="text" value={movieNameFilter} onChange={(event) => {setMovieNameFilter(event.target.value)}} />
                            </FormControl>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="showGenres">Genres</InputLabel>
                                <Select value={genreLabel}>
                                    {genresList.map((genre) => (
                                        <MenuItem key={genre.id}>
                                            <Checkbox 
                                                color="primary" 
                                                name={genre.genre} 
                                                checked={genresFilter[genre.genre]} 
                                                onChange={genreFilterChangedHandler}
                                            />
                                            <span>{genre.genre}</span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.form}>
                                <InputLabel htmlFor="showArtists">Artists</InputLabel>
                                <Select value={artistLabel}>
                                    {artistsList.map((artist) => (
                                        <MenuItem key={artist.id}>
                                            <Checkbox 
                                                color="primary" 
                                                name={`${artist.first_name}_${artist.last_name}`} 
                                                checked={artistsFilter[`${artist.first_name}_${artist.last_name}`]} 
                                                onChange={artistsFilterChangedHandler}
                                            />
                                            <span>{`${artist.first_name} ${artist.last_name}`}</span>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.form}>
                                <TextField
                                    label="Released Start Date"
                                    type="date"
                                    value={releaseStartDateFilter}
                                    onChange={(event) => {setReleaseStartDateFilter(event.target.value)}}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                />
                            </FormControl>
                            <FormControl className={classes.form}>
                                <TextField
                                    label="Released End Date"
                                    type="date"
                                    value={releaseEndDateFilter}
                                    onChange={(event) => {setReleaseEndDateFilter(event.target.value)}}
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                />
                            </FormControl>
                            <br />
                            <br />
                            <Button className={classes.form} variant="contained" color="primary" onClick={applyFilterHandler}>Apply</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Home;