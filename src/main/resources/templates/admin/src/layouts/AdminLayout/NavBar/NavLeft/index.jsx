import React from 'react';

// react-bootstrap
//import { ListGroup } from 'react-bootstrap';

// project import
//import NavSearch from './NavSearch';

// ==============================|| NAV LEFT ||============================== //

import styled from 'styled-components';

const Input = () => {
  return (
    <StyledWrapper>
      <div className="searchbar">
        <div className="searchbar-wrapper">
          <div className="searchbar-left">
            <div className="search-icon-wrapper">
              <span className="search-icon searchbar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                </svg>
              </span>
            </div>
          </div>
          <div className="searchbar-center">
            <div className="searchbar-input-spacer" />
            <input
              type="text"
              className="searchbar-input"
              maxLength={2048}
              name="q"
              autoCapitalize="off"
              autoComplete="off"
              title="Search"
              role="combobox"
              placeholder="Search Google"
              aria-controls="search-suggestions"
              aria-expanded="false"
            />
          </div>
          <div className="searchbar-right">
            <svg className="voice-search" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                fill="#4285f4"
                d="m12 15c1.66 0 3-1.31 3-2.97v-7.02c0-1.66-1.34-3.01-3-3.01s-3 1.34-3 3.01v7.02c0 1.66 1.34 2.97 3 2.97z"
              ></path>
              <path fill="#34a853" d="m11 18.08h2v3.92h-2z" />
              <path fill="#fbbc05" d="m7.05 16.87c-1.27-1.33-2.05-2.83-2.05-4.87h2c0 1.45 0.56 2.42 1.47 3.38v0.32l-1.15 1.18z"></path>
              <path
                fill="#ea4335"
                d="m12 16.93a4.97 5.25 0 0 1 -3.54 -1.55l-1.41 1.49c1.26 1.34 3.02 2.13 4.95 2.13 3.87 0 6.99-2.92 6.99-7h-1.99c0 2.92-2.24 4.93-5 4.93z"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};
const StyledWrapper = styled.div`
  .searchbar {
    font-size: 14px;
    font-family: arial, sans-serif;
    color: #202124;
    display: flex;
    align-items: center;
    z-index: 3;
    height: 44px;
    background: white;
    border: 1px solid #dfe1e5;
    box-shadow: none;
    border-radius: 24px;
    margin: 0 auto;
    width: 100%;
    max-width: 1000px;
    padding: 0 12px;
    box-sizing: border-box;
  }

  .searchbar:hover {
    box-shadow: 0 1px 6px rgb(32 33 36 / 28%);
    border-color: rgba(223, 225, 229, 0);
  }

  .searchbar-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
  }

  .searchbar-left {
    display: flex;
    align-items: center;
    margin-right: 10px;
  }

  .search-icon {
    color: #9aa0a6;
    height: 20px;
    width: 20px;
  }

  .searchbar-icon {
    display: inline-block;
    fill: currentColor;
    height: 24px;
    width: 24px;
  }

  .searchbar-center {
    display: flex;
    flex: 1;
    align-items: center;
  }

  .searchbar-input {
    background-color: transparent;
    border: none;
    outline: none;
    width: 100%;
    height: 34px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
  }

  .searchbar-right {
    display: flex;
    align-items: center;
    margin-left: 8px;
  }

  .voice-search {
    cursor: pointer;
    display: flex;
    align-items: center;
    width: 24px;
    height: 24px;
    background: transparent;
    padding: 0;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .searchbar {
      height: 40px;
      border-radius: 20px;
      padding: 0 10px;
    }

    .searchbar-input {
      font-size: 14px;
      height: 30px;
    }

    .searchbar-icon,
    .voice-search {
      height: 20px;
      width: 20px;
    }
  }

  @media (max-width: 480px) {
    .searchbar {
      max-width: 100%;
      padding: 0 8px;
    }

    .searchbar-input {
      font-size: 13px;
    }
  }
`;

export default Input;
