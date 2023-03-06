import React, {useState, useContext} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillLock, AiFillUnlock } from 'react-icons/ai';

//IMPORT INTERNAL
import { VotingContext } from '../../context/Voter';
import Style from './NavBar.module.css';
import loading from '../../assets/loding.gif'

const NavBar = () => {
  const {
    connectWallet, 
    error, 
    currentAccount} = useContext(VotingContext)
  
  const [openNav, setOpenNav] = useState(false);

  const openNavigation = () => {
    if (openNav) {
      setOpenNav(false)
    } else if (!openNav) {
      setOpenNav(true)
    }
  }

  return (
    <div className={Style.navbar}>
      {error === "" ? 
        ("") : (
          <div className={Style.message_box}>
            <div className={Style.message}>
              <p>{error}</p>
            </div>
          </div>
        )
      }
      <div className={Style.navbar_box}>
        <div className={Style.title}>
          <Link href={{pathname: '/'}}>
            <Image src={loading} alt="logo" width={80} height={80}/>
          </Link>
        </div>

        <div className={Style.connect}>
          {currentAccount ? (
            <div>
              <div className={Style.connect_flex}>
                <button onClick={() => openNavigation()}>
                  {currentAccount.slice(0, 10)}...
                </button>
                {currentAccount && (
                  <span>{
                    openNav ? (
                      <AiFillUnlock  onClick={() => openNavigation()}/>
                    ) : <AiFillLock onClick={() => openNavigation()}/>
                    }</span>
                )}
              </div>
              {
                openNav && (
                  <div className={Style.navigation}>
                    <p>
                      <Link href={{pathname: '/'}}>Home</Link>
                    </p>
                    <p>
                      <Link href={{pathname: 'candidate-registration'}}>Candidate Registration</Link>
                    </p>
                    <p>
                      <Link href={{pathname: 'allowed-voters'}}>Voter Registration</Link>
                    </p>
                    <p>
                      <Link href={{pathname: 'voterList'}}>Voter List</Link>
                    </p>
                  </div>
                )
              }
            </div>
          ) : (
            <button onClick={() => connectWallet()}>Connect Wallet</button>
          )}
        </div>

      </div>
    </div>
  )
}

export default NavBar