import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes,Route} from 'react-router-dom'
import Home from './assets/home/Home'
import NavItems from './assets/components/NavItems'
import Registration from './assets/home/Registration'
import Login from './assets/home/Login'

import Section1 from './assets/home/Section1'
import Categories from './assets/components/Categories'
import Section2 from './assets/home/Section2'
import Reviews from './assets/components/Reviews'

function App() { 
  return (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/section" element={<Section1 />} />
        <Route path="/section2" element={<Section2/>}/>
        <Route path='/categories' element={<Categories />}/>
        <Route path='/Reviews' element={<Reviews />}/>

        {/* Separate Routes for Login & Registration */}
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
</Routes>
    </BrowserRouter>
  )
}

export default App
