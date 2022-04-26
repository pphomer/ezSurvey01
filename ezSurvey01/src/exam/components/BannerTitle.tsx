import React from "react";

export const BannerTitle = ({ imgUrl }) => {
  //console.log("BannerTitle");
  return (
    <section className="banner_img">
      <img src={imgUrl} />
    </section>
  )
}