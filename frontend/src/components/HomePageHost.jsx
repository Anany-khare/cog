<<<<<<< HEAD
import React from 'react'
import { Link } from 'react-router-dom'

function HomePageHost() {
=======
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

function HomePageHost() {
  const dispatch = useDispatch()

>>>>>>> d997b8b (Initial commit: project ready for deployment)
  return (
    <div>HomePageHost
    <Link to='/chat'>
    <button>chat</button>
    </Link>
  </div>
  )
}

export default HomePageHost