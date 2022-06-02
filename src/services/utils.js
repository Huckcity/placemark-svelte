export const prettyDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  // @ts-ignore
  return new Date(date).toLocaleDateString("en-US", options);
};

export const averageRating = (reviews) => {
  let sum = 0;
  reviews.forEach((review) => {
    sum += review.rating;
  });
  return Math.round(sum / reviews.length);
};

export const kelvinToCelsius = (kelvin) => {
  return Math.round(kelvin - 273.15);
};

export const defaultDate = (date) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  // @ts-ignore
  return new Date(date).toLocaleDateString("en-US", options);
};
