import React from "react";
import PlaceItem from "./PlaceItem";
// import { motion } from "framer-motion";

const ImageGrid = ({ places }) => {
    return (
        <div className="img-grid">
            {places &&
                places.map((place) => (
                    <PlaceItem
                        key={place.id}
                        id={place.id}
                        image={place.url}
                        title={place.title}
                        description={place.description}
                        address={place.address}
                        creatorId={place.creator}
                        coordinates={place.location}
                    />
                ))}
        </div>
    );
};

export default ImageGrid;
