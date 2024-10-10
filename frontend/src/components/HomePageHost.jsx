import React from 'react'
import { Link } from 'react-router-dom'

function HomePageHost() {
  return (
    <div>HomePageHost
    <Link to='/chat'>
    <button>chat</button>
    </Link>
  </div>
  )
}

export default HomePageHost