import React, { useEffect, useRef } from 'react';
import SwiperCore, { Navigation, Thumbs } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';


function Gallery() {
    SwiperCore.use([Navigation, Thumbs]);
    const Gallery = () => {
        const [thumbsSwiper, setThumbsSwiper] = React.useState(null);
        const [lightboxImage, setLightboxImage] = React.useState('');
        const [isLightboxOpen, setLightboxOpen] = React.useState(false);
      
        const handleImageClick = (src) => {
          setLightboxImage(src);
          setLightboxOpen(true);
        };
      
        const closeLightbox = () => {
          setLightboxOpen(false);
        };



  return (
    <section className="py-24 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-5 lg:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-gray-900 text-4xl font-bold leading-normal pb-2.5">Our Gallery</h2>
          <p className="text-gray-600 text-lg font-normal leading-8">
            Explore the essence of beauty in our gallery's intimate space.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-8 mx-auto">
          <div className="slider-box flex flex-col xl:flex-row gap-8">
            <div className="box xl:w-[1062px] w-full">
              <Swiper
                className="main-slide-carousel"
                thumbs={{ swiper: thumbsSwiper }}
                slidesPerView={1}
                effect="fade"
              >
                {[
                  "https://pagedone.io/asset/uploads/1713943683.png",
                  "https://pagedone.io/asset/uploads/1713943709.png",
                  "https://pagedone.io/asset/uploads/1713943720.png",
                  "https://pagedone.io/asset/uploads/1713943731.png"
                ].map((src, index) => (
                  <SwiperSlide key={index}>
                    <div className="block xl:w-[1062px] w-full mx-auto h-[627px] rounded-3xl overflow-hidden">
                      <img
                        src={src}
                        alt={`Gallery image ${index + 1}`}
                        className="gallery-image w-full h-full object-cover rounded-3xl cursor-pointer"
                        onClick={() => handleImageClick(src)}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="xl:w-[126px] w-full">
              <Swiper
                onSwiper={setThumbsSwiper}
                className="nav-for-slider"
                slidesPerView={4}
                spaceBetween={30}
                loop={true}
              >
                {[
                  "https://pagedone.io/asset/uploads/1713943683.png",
                  "https://pagedone.io/asset/uploads/1713943709.png",
                  "https://pagedone.io/asset/uploads/1713943720.png",
                  "https://pagedone.io/asset/uploads/1713943731.png"
                ].map((src, index) => (
                  <SwiperSlide key={index} className="thumbs-slide cursor-pointer">
                    <img
                      src={src}
                      alt={`Thumbnail ${index + 1}`}
                      className="gallery-image w-full h-full rounded-2xl border-2 border-gray-200 transition-all duration-500 hover:border-indigo-600 object-cover"
                      onClick={() => handleImageClick(src)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        {isLightboxOpen && (
          <div className="lightbox fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-80 flex items-center justify-center">
            <span className="close text-white text-3xl absolute top-5 right-7 cursor-pointer" onClick={closeLightbox}>&times;</span>
            <img src={lightboxImage} alt="Lightbox" className="lightbox-image max-w-full max-h-full" />
          </div>
        )}
      </div>
    </section>
  );
};
}

export default Gallery