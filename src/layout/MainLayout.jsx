import React from 'react'

function MainLayout({children}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
    <main className="flex-grow w-full max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-6 mt-6">
      {children}
    </main>
  </div>
  )
}

export default MainLayout