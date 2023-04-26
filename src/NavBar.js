import React from 'react'
import { Link } from 'react-router-dom'
import './NavBar.css'

export default function NavBar() {

  const links = [
  {name: 'Home', link: '/'},
  {name:'Table', link: '/table'},
  {name:'Chart', link: '/chart'}
]

  return (
    <nav className='navbar'>
      <ul className='nav-options'>
        {links.map(({name, link}) => {
          return(
            <li key={name}>
              <Link to={link}>{name}</Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
