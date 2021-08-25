import React from 'react';
import { Typography, Link as Anchor, GridList, GridListTile, GridListTileBar } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Link, useParams } from 'react-router-dom';
import "./Details.css";
import YouTube from 'react-youtube';
import Header from "../../common/header/Header";


function Details(props) {

    const {id} = useParams();
    // Some default values so there is no error while rendering
    const [movieDetails, setMovieDetails] = React.useState({
        artists: [],
        genres: [],
        trailer_url: "https://www.youtube.com/watch?v=2g811Eo7K8U"
    });
    const opts = {
        width: "100%",
        playerVars: {
          autoplay: 1,
        },
      };

    React.useEffect(async () => {
        const rawResponse = await fetch(props.baseUrl + "movies/" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                Authorization: "Bearer " + sessionStorage.getItem("access-token")
            }
        })

        const data = await rawResponse.json();
        setMovieDetails(data);
    }, []);

    const getvideoId =(url) => {
        return url.split("?")[1].slice(2);
    }

    const videoOnReady = (event) => {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
    }

    return (
        <React.Fragment>
            <Header baseUrl={props.baseUrl} showBookingButton={true} />
            <div className="details-page-container">
                <div className="left-container">
                    <br />
                    <br />
                    <Typography>
                        <Link to="/" className="back-btn">&#60; Back to Home</Link>
                    </Typography>
                    <img className="movie-poster" src={movieDetails.poster_url} alt={movieDetails.title + " movie poster"} />
                </div>
                <div className="middle-container">
                    <br />
                    <Typography variant="headline" component="h2">
                        {movieDetails.title}
                    </Typography>
                    <Typography component="span">
                        <span className="bold-text">{"Genre: "}</span>
                        {movieDetails.genres.join(", ")}
                    </Typography>
                    <br />
                    <Typography component="span">
                        <span className="bold-text">{"Duration: "}</span>
                        {movieDetails.duration}
                    </Typography>
                    <br />
                    <Typography component="span">
                        <span className="bold-text">{"Release Date: "}</span>
                        {new Date(movieDetails.release_date).toDateString()}
                    </Typography>
                    <br />
                    <Typography component="span">
                        <span className="bold-text">{"Rating: "}</span>
                        {movieDetails.rating}
                    </Typography>
                    <br />
                    <br />
                    <Typography component="span">
                        <span className="bold-text">{"Plot: "}</span>
                        {"("}
                        <Anchor href={movieDetails.wiki_url}>Wiki link</Anchor>
                        {") "}
                        {movieDetails.storyline}
                    </Typography>
                    <br />
                    <br />
                    <Typography component="span">
                        <span className="bold-text">{"Trailer: "}</span>
                    </Typography>
                    <YouTube videoId={getvideoId(movieDetails.trailer_url)} opts={opts} onReady={videoOnReady} />
                </div>
                <div className="right-container">
                    <br />
                    <br />
                    <Typography component="legend"><span className="bold-text">Rate this movie:</span></Typography>
                    <Rating
                        defaultValue={0}
                        precision={1}
                        emptyIcon={<StarBorderIcon fontSize="inherit" className="rating-icon"/>}
                    />
                    <br />
                    <br />
                    {/* The line breaks are because the margin property could not be apllied */}
                    <Typography component="span">
                        <span className="bold-text artist-text">Artists:</span>
                    </Typography>
                    <br />
                    <br />
                    <GridList cellHeight={200} cols={2} spacing={10} className="carousel-artists">
                        {
                            movieDetails.artists.map(artist => {
                                return (
                                    <GridListTile key={artist.id}>
                                        <img src={artist.profile_url} alt={`${artist.first_name} ${artist.last_name}`} />
                                        <GridListTileBar title={`${artist.first_name} ${artist.last_name}`} />
                                    </GridListTile>
                                );
                            })
                        }
                    </GridList>
                </div>
            </div>
        </React.Fragment>
    );
}

export default Details;