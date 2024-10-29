import React from 'react'
import gallery1 from '../../assets/img/gallery/gallery1.jpg'
import gallery2 from '../../assets/img/gallery/gallery2.jpg'
import gallery3 from '../../assets/img/gallery/gallery3.jpg'
import gallery4 from '../../assets/img/gallery/gallery4.jpg'
import gallery5 from '../../assets/img/gallery/gallery5.jpg'

function Gallery() {
  return (
    <section className="py-24 relative">
  <div className="w-full max-w-7xl px-6 lg:px-8 mx-auto">
    <div className="flex items-center justify-center flex-col gap-5 mb-14">
      <span className='bg-indigo-50 text-indigo-500 text-xs font-medium px-3.5 py-1 rounded-full'>Gallery</span>
      <h2 className="font-manrope font-bold text-4xl text-gray-900 text-center">Efficient Service Delivery</h2>
      <p className="text-lg font-normal text-gray-500 max-w-3xl mx-auto text-center">
      In the world of automated service, kiosks provide a streamlined and user-friendly way to meet customer needs. With intuitive interfaces and efficient functionality, kiosks simplify processes, enhance accessibility, and improve customer experience across various sectors.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
      <div
        className="sm:col-span-2 bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6"
        style={{ backgroundImage: `url(${gallery1})` }}
      >
        <h6 className="font-medium text-xl leading-8 text-white mb-4">Creative Strategist</h6>
        <p className="text-base font-normal text-white/70">
        Crafting ideas that inspire, strategies that resonate, and visions that transform into impactful experiences.
        </p>
      </div>
      <div className="block">
        <img src={gallery2} alt="Building structure image" className="w-full h-[320px] rounded-lg object-cover" />
      </div>
      <div className="block">
        <img src={gallery3} alt="Building structure image" className="w-full h-[320px] rounded-lg object-cover" />
      </div>
      <div className="block">
        <img src={gallery4} alt="Building structure image" className="w-full h-[320px] rounded-lg object-cover" />
      </div>
      <div
        className="bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6"
        style={{ backgroundImage: 'url(https://pagedone.io/asset/uploads/1707713043.png)' }}
      >
        <h6 className="font-medium text-xl leading-8 text-white mb-4">Digital Visionary</h6>
        <p className="text-base font-normal text-white/70">
        Bridging technology and imagination, bringing future-forward concepts to life through innovative digital solutions.
        </p>
      </div>
      <div
        className="sm:col-span-2 bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6"
        style={{ backgroundImage: `url(${gallery5})` }}
      >
        <h6 className="font-medium text-xl leading-8 text-white mb-4">Experience Curator</h6>
        <p className="text-base font-normal text-white/70">
        Designing with purpose, every element crafted to engage, inspire, and leave a lasting impression.
        </p>
      </div>
    </div>
  </div>
</section>

  )
}

export default Gallery