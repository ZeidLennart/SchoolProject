import React, { useState } from 'react';
import Link from 'next/link';
import styles from'../../../styles/Navstyles.module.css'; 


const NavLink = ({items, cur, firstelem, Moke}) => {
    
    if(!items || !items.length) {
        return null
    }
    const [active, setactive] = useState(Moke);
   
    function reload(e){
        e.preventDefault();
        setactive(!active);
    }
    //console.log(items)
    const Navcomponent = items.map(item => {
        if(!item.children || !item.children.length){
            return(                
            <Link href={cur + "/" + item.url} key={item._id} className={styles.NavLink}> 
                <div key={item._id} className={styles.TableRow} id={item._id} data-id={0}>
                    <a className={styles.NavDivName}>{item.name}</a>
                </div>
            </Link>)
        }else{
            let childs = <></>;
            let plusorminus = "+";
            let isactiveStyling = styles.extraDiv;
            if(firstelem || active){
                childs = <div className={styles.TableRow}><NavLink items={item.children} cur={cur + "/" + item.url} Moke = {Moke}> {item.name} </NavLink> </div> 
                plusorminus = "-";
                isactiveStyling = styles.extradivActive;
            }
            return(
            <div key={item._id} className={styles.TableRow} id={item._id} data-id={1}>
                <div className={isactiveStyling} onClick={(e) => reload(e)}>
                    <a className={styles.NavDivName}>{item.name}</a>
                    <a className={styles.arrowed}>{plusorminus}</a>
                </div>
                {childs}     
            </div>)
        }
    })

    return( 
        <>
            {Navcomponent}
        </>
    )
}

export default NavLink
