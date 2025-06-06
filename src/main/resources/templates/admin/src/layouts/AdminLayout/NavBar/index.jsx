import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// project import
import NavRight from './NavRight';
import { ConfigContext } from '../../../contexts/ConfigContext';
import * as actionType from '../../../store/actions';

// assets
import logo from '../../../assets/images/logo4.png';

const NavBar = () => {
  const [moreToggle, setMoreToggle] = useState(false);
  const configContext = useContext(ConfigContext);
  const { collapseMenu, layout } = configContext.state;
  const { dispatch } = configContext;

  const navToggleHandler = () => {
    dispatch({ type: actionType.COLLAPSE_MENU });
  };

  let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', 'header-light'];
  if (layout === 'vertical') headerClass.push('headerpos-fixed');

  let moreClass = ['mob-toggler'];
  let collapseClass = ['collapse navbar-collapse'];
  if (moreToggle) {
    moreClass.push('on');
    collapseClass.push('d-block');
  }

  return (
      <HeaderWrapper className={headerClass.join(' ')}>
        <div className="m-header flex-header">
          <div className="left-group">


            <StyledWrapper>
              <label className="burger" htmlFor="burger">
                <input type="checkbox" id="burger" onChange={navToggleHandler} checked={collapseMenu} />
                <span />
                <span />
                <span />
              </label>
            </StyledWrapper>
            <Link to="/" className="b-brand">
              <img id="main-logo" src={logo} alt="Logo" className="logo" />
            </Link>
          </div>

          <Link to="#" className={moreClass.join(' ')} onClick={() => setMoreToggle(!moreToggle)}>
            <i className="feather icon-more-vertical" />
          </Link>
        </div>

        <div className={`${collapseClass.join(' ')} nav-section`}>
          <div className="nav-spacer" />
          <div className="nav-right">
            <NavRight />
          </div>
        </div>
      </HeaderWrapper>
  );
};

export default NavBar;

// Styled Components
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  background-color: #fff;
  z-index: 1009;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  user-select: none;

  .flex-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 1.25rem;
  }

  .left-group {
    display: flex;
    align-items: center;
  }

  .b-brand {
    display: flex;
    align-items: center;
    margin-right: 1rem;
  }

  .logo {
    height: 80px;
    object-fit: contain;
  }

  .mob-toggler {
    display: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #000;
  }

  .mob-toggler.on {
    color: #007bff;
  }

  .nav-section {
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
  }

  .nav-spacer {
    flex: 1;
  }

  .nav-right {
    display: flex;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  @media (max-width: 992px) {
    .mob-toggler {
      display: block;
    }

    .nav-section {
      flex-direction: column;
      align-items: flex-start;
      display: none;
      background: #fff;
      position: absolute;
      top: 80px;
      left: 0;
      right: 0;
      border-top: 1px solid #ddd;
      z-index: 1000;
      padding: 0.75rem 1rem;
    }

    .nav-section.d-block {
      display: flex;
    }

    .nav-right {
      width: 100%;
      justify-content: flex-start;
    }

    .nav-spacer {
      display: none;
    }
  }
`;

const StyledWrapper = styled.div`
  .burger {
    position: relative;
    width: 26px;
    height: 18px;
    background: transparent;
    cursor: pointer;
    display: block;
    margin-right: 2rem;
  }

  .burger input {
    display: none;
  }

  .burger span {
    display: block;
    position: absolute;
    height: 3px;
    width: 100%;
    background: #38b6ff;
    border-radius: 9px;
    left: 0;
    transition: 0.25s ease-in-out;
  }

  .burger span:nth-of-type(1) {
    top: 0;
  }

  .burger span:nth-of-type(2) {
    top: 50%;
    transform: translateY(-50%);
  }

  .burger span:nth-of-type(3) {
    top: 100%;
    transform: translateY(-100%);
  }

  .burger input:checked ~ span:nth-of-type(1) {
    transform: rotate(45deg);
    top: 9px;
    left: 4px;
  }

  .burger input:checked ~ span:nth-of-type(2) {
    width: 0%;
    opacity: 0;
  }

  .burger input:checked ~ span:nth-of-type(3) {
    transform: rotate(-45deg);
    top: 9px;
    left: 4px;
  }
`;
