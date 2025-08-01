import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import StarRating from "./StarRating";

const root = ReactDOM.createRoot(document.getElementById("root"));
// function Test() {
//   let [movieRating, setMovieRating] = useState(0);
//   return (
//     <div>
//       {" "}
//       <StarRating
//         onMovieRating={setMovieRating}
//         maxRating={5}
//         messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
//       />
//       <p>this movie was rated{movieRating} stars</p>
//     </div>
//   );
// }
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      defaultRating={3}
      maxRating={5}
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    /> */}
    {/* <Test /> */}
  </React.StrictMode>
);
