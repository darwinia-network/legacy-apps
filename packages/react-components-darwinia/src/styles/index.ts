// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { createGlobalStyle } from 'styled-components';

import media from '../media';
import cssComponents from './components';
import cssForm from './form';
import cssMedia from './media';
import cssRx from './rx';
import cssSemantic from './semantic';
import cssTheme from './theme';

export default createGlobalStyle`
  #root {
    color: #4e4e4e;
    font-family: sans-serif;
    height: 100%;
  }

  a {
    cursor: pointer;
  }

  article {
    background: white;
    border: 1px solid #f2f2f2;
    border-radius: 0.25rem;
    box-sizing: border-box;
    margin: 0.25rem;
    padding: 1.25rem;
    position: relative;
    text-align: left;

    &:hover {
      /* box-shadow: 0 4px 8px rgba(0,0,0,0.1); */
      /* box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      border-color: transparent; */
    }

    &:not(:hover) {
      .ui.button:not(.disabled) {
        background: #eee !important;
        color: #555 !important;
      }

      .ui.toggle.checkbox input:checked~.box:before,
      .ui.toggle.checkbox input:checked~label:before {
        background-color: #eee !important;
      }

      .ui.button.mini {
        visibility: hidden;
      }
    }

    > ul {
      margin: 0;
      padding: 0;
    }

    &.error,
    &.warning {
      margin-left: 2rem;
    }

    &.nomargin {
      margin-left: 0;
    }

    &.error {
      background: #fff6f6;
      border-color: #e0b4b4;
      color: #9f3a38;
    }

    &.padded {
      padding: 0.75rem 1rem;

      > div {
        margin: 0.25rem;
      }
    }

    &.warning {
      background: #ffffe0;
      border-color: #eeeeae;
    }
  }

  body {
    height: 100%;
    margin: 0;
    line-height: unset;
  }

  br {
    line-height: 1.5rem;
  }

  details {
    cursor: pointer;

    &[open] > summary {
      white-space: normal;

      br, br + * {
        display: block;
      }
    }

    > summary {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      outline: none;

      br, br + * {
        display: none;
      }
    }
  }

  h1, h2, h3, h4, h5 {
    color: rgba(0, 0, 0, .6);
    font-family: sans-serif;
    /* font-weight: 100; */
  }

  h1 {
    /* text-transform: lowercase; */

    em {
      font-style: normal;
      text-transform: none;
    }
  }

  h3, h4, h5 {
    margin-bottom: 0.25rem;
  }

  header {
    margin-bottom: 1.4rem;
    text-align: center;

    ${media.TABLET`
      margin-bottom: 2rem;
   `}

    > article {
      background: transparent;
    }
  }

  html {
    height: 100%;
  }

  label {
    box-sizing: border-box;
    color: rgba(78, 78, 78, .66);
    display: block;
    font-family: sans-serif;
    font-size: 1rem;
    font-weight: 100;
  }

  main {
    min-height: 100vh;

    > section {
      margin-bottom: 2em;
    }
  }

  ul.pagination  {
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
  }

  ul.pagination li {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    border-radius:2px;
    border:1px solid #999; 
    margin-left: 2.5px;
    margin-right: 2.5px;
    min-width: 30px;
    min-height: 30px;
  }

  ul.pagination li.active {
    border-radius:2px;
    border:1px solid #666; 
  }

  ul.pagination li a{
    color: #999;
    padding: 5px 8px;
    display: inline-block;
    width: 100%;
    text-align: center;
  }


  ul.pagination .previous, ul.pagination .next{
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    border: 0;
    border-radius: 2px;
    text-align: center;
  }

  ul.pagination .previous a, ul.pagination .next a{
    color: #fff;
    padding: 6px 9px;
    border-radius: 2px;
    background:linear-gradient(315deg,rgba(254,56,118,1) 0%,rgba(124,48,221,1) 71%,rgba(58,48,221,1) 100%);
  }

  ul.pagination li.active a{
    color: #666666;
    padding: 5px 8px;
    display: block;
    background: #F4F6F9;
  }

  .theme--default {
    .statusButtons {
      .ui.active.button{
        background-color: #fff;
        color: rgba(0,0,0,.95);
        border: 1px solid #302B3C;
        padding: .58571429em 1.5em .58571429em;
        color: #302B3C;
      }
      .ui.button{
        background: #fff;
        color: #B3B3B3;
      }
      .ui.buttons{
        background: #fff;
        border: 1px solid #EDEDED;
        border-radius: .28571429rem;
      }
    }

    .titleRow {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      text-transform: uppercase;
      .titleRow-main{
        font-weight: bold;
        margin-left: 10px;
        font-size: 16px;
      }
    }

    .titleRow::before {
      content: ' ';
      display: inline-block;
      background:linear-gradient(315deg,rgba(254,56,118,1) 0%,rgba(124,48,221,1) 71%,rgba(58,48,221,1) 100%);
      width: 3px;
      height: 18px;
    }
  }
  
  /* Add our overrides */
  ${cssSemantic}
  ${cssTheme}
  ${cssForm}
  ${cssMedia}
  ${cssRx}
  ${cssComponents}
`;
