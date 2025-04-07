import React, { useEffect } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
    useEffect(()=>{
    },[category])

  return (
    <div className='explore-menu' id='explore-menu'>
        <h1>Explore Our Menu</h1>
        <p className='explore-menu=text'>Our food ordering app makes it easy to browse, order, and enjoy your favorite meals from local restaurants with just a few taps. Experience fast delivery, secure payments, and a seamless dining experience from the comfort of your home!</p>
        <div className="explore-menu-list">
            {menu_list.map((item,index)=>{
                return (
                    <div onClick={()=>setCategory(prev=> prev === item.name ? 'All' : item.name)} key={index} className="explore-menu-list-item">
                        <img className={category===item.name?'active':''} src={item.menu_image} alt="" />
                        <p>{item.name}</p>
                    </div>
                )
            })}
        </div>
        <hr/>
    </div>
  )
}

export default ExploreMenu