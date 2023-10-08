import React from 'react'

import AlertA from '../components/Alert/AlertA'
import AlertSidebar from '../components/Alert/AlertSidebar'

function Alert() {
  return (
    <div className="bg-gray-300 absolute right-0 w-5/6 h-screen">
      <AlertSidebar />
      <AlertA />
    </div>
  )
}

export default Alert
