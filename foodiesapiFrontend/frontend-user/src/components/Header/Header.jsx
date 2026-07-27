import React from 'react'
import {Link} from 'react-router-dom'
import "./Header.css"
function Header() {
  return (
    <div className="p-5 mb-4 bg-light rounded-3 mt-1 header">
        <div className="container-fluid p-5">
            <h1 className='display-5 fw-bold'> Order Your Favorite Food Here </h1>
            <p className='col-md-8 fs-4'>Discover The Best Food & Drinks in Kolkata </p>
            <Link to='/explore' className="btn btn-primary ">Explore</Link>
        </div>
    </div>
  )
}

export default Header ;