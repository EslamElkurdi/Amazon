import React, { useState } from "react";

const StarRating = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleMouseEnter = (index) => {
    setHoverRating(index);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index) => {
    onRatingChange(index);
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(starValue)}
            style={{
              cursor: "pointer",
              color:
                starValue <= (hoverRating || rating) ? "#FFD700" : "#C0C0C0",
            }}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
