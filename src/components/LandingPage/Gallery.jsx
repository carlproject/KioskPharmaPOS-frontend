import React from 'react'

function Gallery() {
  return (
    <section className="py-24 relative">
  <div className="w-full max-w-7xl px-6 lg:px-8 mx-auto">
    <div className="flex items-center justify-center flex-col gap-5 mb-14">
      <span className='bg-indigo-50 text-indigo-500 text-xs font-medium px-3.5 py-1 rounded-full'>Portfolio</span>
      <h2 className="font-manrope font-bold text-4xl text-gray-900 text-center">Structural Elegance</h2>
      <p className="text-lg font-normal text-gray-500 max-w-3xl mx-auto text-center">
        In the world of architecture or organization, structure provides the backbone for a purposeful and harmonious existence.
      </p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-14">
      <div
        className="sm:col-span-2 bg-cover bg-center max-md:h-80 rounded-lg flex justify-end flex-col px-7 py-6"
        style={{ backgroundImage: 'url(https://pagedone.io/asset/uploads/1707712993.png)' }}
      >
        <h6 className="font-medium text-xl leading-8 text-white mb-4">Architecture Designer</h6>
        <p className="text-base font-normal text-white/70">
          where knowledge meets innovation, and success is sculpted through a blend of skill and vision.
        </p>
      </div>
      <div className="block">
        <img src="https://pagedone.io/asset/uploads/1707713007.png" alt="Building structure image" className="w-full rounded-lg object-cover" />
      </div>
      <div className="block">
        <img src="https://pagedone.io/asset/uploads/1707713018.png" alt="Building structure image" className="w-full rounded-lg object-cover" />
      </div>
      <div className="block">
        <img src="https://pagedone.io/asset/uploads/1707713032.png" alt="Building structure image" className="w-full rounded-lg object-cover" />
      </div>
      <div
        className="bg-cover rounded-lg max-sm:h-80 flex justify-start flex-col px-7 py-6"
        style={{ backgroundImage: 'url(https://pagedone.io/asset/uploads/1707713043.png)' }}
      >
        <h6 className="font-medium text-xl leading-8 text-white mb-4">Interior Designer</h6>
        <p className="text-base font-normal text-white/70">
          Crafting exceptional interiors, where aesthetics meet functionality for spaces that inspire and elevate.
        </p>
      </div>
      <div className="block">
        <img src="https://pagedone.io/asset/uploads/1707713055.png" alt="Building structure image" className="w-full rounded-lg object-cover" />
      </div>
      <div
        className="bg-cover rounded-lg max-sm:h-80 flex justify-end flex-col px-7 py-6"
        style={{ backgroundImage: 'url(https://pagedone.io/asset/uploads/1707713066.png)' }}
      >
        <h6 className="font-medium text-xl leading-8 text-white mb-4">Business Building</h6>
        <p className="text-base font-normal text-white/70">
          Architecting business success through innovation, resilience, and strategic leadership.
        </p>
      </div>
    </div>
  </div>
</section>

  )
}

export default Gallery