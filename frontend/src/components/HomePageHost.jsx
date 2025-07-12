import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function HomePageHost() {
  const dispatch = useDispatch()

  return (
    <div>HomePageHost
    <Link to='/chat'>
    <button>chat</button>
    </Link>
  </div>
  )
}

export default HomePageHost