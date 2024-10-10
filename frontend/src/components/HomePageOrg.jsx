import React from 'react'
import { Link } from 'react-router-dom'

function HomePageOrg() {
  return (
    <div>HomePageOrg
    <Link to='/chat'>
    <button>chat</button>
    </Link>
  </div>
  )
}

export default HomePageOrg