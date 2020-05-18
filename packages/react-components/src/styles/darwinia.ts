// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';
import { colorBtnPrimary } from './theme';

export default css`
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

  .ui--Modal {
    .close-btn {
      width: 48px;
      height: 48px;
      position: absolute;
      top: 0;
      right: -68px;
      cursor: pointer;
    }
  }

  .theme--default {
    .ui.button,
    .ui.buttons .button {
      border-radius: 2px;
    }

    .ui.basic.button {
      box-shadow: 0 0 0 1px #302B3C inset;
      color: ${colorBtnPrimary}!important;
    }

    .ui.button:not(.dropdown) {
      padding: 0.57em 1.5em 0.57em
    }
  }

  .ui--Button-Group .button {
    border-radius: 2px !important;
  }
`;
