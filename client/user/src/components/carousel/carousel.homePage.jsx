function CarouselHomePage() {
  return (
    <div
      className="container-fluid d-flex justify-content-center"
      style={{
        width: "70%",
      }}
    >
      <div
        id="carouselExampleControls"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="https://www.shutterstock.com/image-vector/social-media-post-template-camera-600nw-2178899555.jpg"
              alt=""
              style={{ height: "300px" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://static.vecteezy.com/system/resources/thumbnails/048/275/574/small/photography-club-twitter-header-template-editor_template.jpeg"
              alt=""
              style={{ height: "300px" }}
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://cdn-template.picsart.com/templates-cdn/ca93bc19-7b40-420d-9919-d23814aa8cfc.jpg"
              alt=""
              style={{ height: "300px" }}
            />
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleControls"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}

export default CarouselHomePage;
