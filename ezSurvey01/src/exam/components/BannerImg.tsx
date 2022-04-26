import React from "react";


const BannerImg = ({ imgUrl }) => {
  console.log("BannerImg");
  return (
    <figure>
      <img src={imgUrl} />
    </figure>
  )
}

export default React.memo(BannerImg)