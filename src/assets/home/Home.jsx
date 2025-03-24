import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import NavItems from '../components/NavItems'
import Section1 from './Section1'
import Categories from '../categories/Categories'
import Section2 from './Section2'
import Reviews from '../components/Reviews'

import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
       <NavItems/> 
       <Section1/>
       <Section2/>
       <Categories/>
       <Reviews/>
       <Outlet />
       <Footer/>

    </div>
  )
}

export default Home
