import React from "react";
import PlaceItem from "./PlaceItem";
// import { motion } from "framer-motion";

const ImageGrid = ({ places }) => {
    return (
        <div className="img-grid">
            {/* map: for each element in places, call callback function (return PlaceItem component)*/}
            {places &&
                places.map((place) => (
                    <PlaceItem
                        key={place}
                        id={place.id}
                        image={place.image}
                        title={place.title}
                        description={place.description}
                        address={place.address}
                        creatorId={place.creator}
                        coordinates={JSON.parse(place.location)}
                    />
                ))}
        </div>
    );
};

export default ImageGrid;
