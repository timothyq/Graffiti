import React, { useEffect, useState} from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/hook-http";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";
import Title from "../components/Title";
import ImageGrid from "../components/ImageGrid";


const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const userId = useParams().userId;
    
    useEffect(() => {
        
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(
                    `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
                );
                setLoadedPlaces(responseData.places);
            } catch (err) {}
        };
        fetchPlaces();
    }, [sendRequest, userId]);

    const placeDeleteHandler = (deletedPlace) => {
        setLoadedPlaces((prePlaces) =>
            prePlaces.filter((place) => place.id !== deletedPlace)
        );
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            {!isLoading && loadedPlaces && (
                <PlaceList
                    items={loadedPlaces}
                    onDeletePlace={placeDeleteHandler}
                />
            )}
        </React.Fragment>
    );
};

export default UserPlaces;
