// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { css } from 'styled-components';

export default css`
  .ui.hidden.divider {
    margin: 0.5rem 0;
  }

  .ui.dropdown {
    display: block;
    min-width: 0;
    width: 100%;
  }

  .ui.dropdown,
  .ui.input {
    margin: 0.25rem 0;
  }

  .ui.selection.dropdown,
  .ui.input > input {
    color: inherit;
    border-radius: 2px;
  }

  .ui.compact.selection.dropdown {
    color: #302B3C!important;
    background-color: #fff!important;
    border: 1px solid #302B3C!important;
    font-weight: normal;
  }

  .ui.action.input:not([class*="left action"])>.button:last-child, .ui.action.input:not([class*="left action"])>.buttons:last-child>.button, .ui.action.input:not([class*="left action"])>.dropdown:last-child {
    border-radius: 0 2px 2px 0;
  }

  .ui.action.input:not([class*="left action"])>input:focus {
      border-right-color: rgba(34,36,38,.15)!important;
  }

  .ui.input.focus>input, .ui.input>input:focus {
    border-color: rgba(34,36,38,.15);
    background: #fff;
    color: rgba(0,0,0,.8);
    -webkit-box-shadow: none;
    box-shadow: none;
  }

  .ui.selection.dropdown>.delete.icon, .ui.selection.dropdown>.dropdown.icon, .ui.selection.dropdown>.search.icon {
    margin: -.78571429em -1.2em;
  }

  .ui.dropdown {
    &.disabled {
      background: transparent;
      border-color: #eee;
      border-style: dashed;
      opacity: 1;

      .dropdown.icon {
        opacity: 0;
      }
    }

    > .text {
      min-height: 1em;
    }
  }

  .ui.dropdown .menu > .item.header.disabled {
    margin: 1em 0 0 0;
    opacity: 1;
  }

  .ui.dropdown .menu > .item.header.disabled:hover,
  .ui.dropdown .menu > .item.header.disabled.selected {
    background: white;
  }

  .ui.input {
    width: 100%;

    &.disabled {
      opacity: 1;

      input {
        background: transparent;
        border-color: #eee;
        border-style: dashed;
      }

      .ui.primary.buttons .ui.button {
        background: #eee;
        border-color: transparent;
        border-left-color: transparent;
        color: #4e4e4e;

        .dropdown.icon {
          opacity: 0;
        }
      }
    }

    &.disabled.error input {
      background-color: #fff6f6;
      border-color: #e0b4b4;
    }

    > input {
      width: 0;
    }
  }

  .ui.inverted.dimmer {
    background-color: rgba(48, 43, 60, 0.8);
    padding: 0 1rem 1rem;
  }

  .ui.label:not(.ui--Bubble) {
    background: transparent;
    font-weight: normal;
    position: relative;
    z-index: 1;
  }

  .ui.modal {
    background: #fff;
    color: #4e4e4e;
    font-family: sans-serif;
    border-radius: 0;
    > .actions,
    > .content {
      background: transparent;
      padding: 1.5rem 3rem;
    }

    > .actions {
      border-top: none;
      text-align: right;
      padding: 1.875rem 3rem !important;
      .ui.buttons .button {
        padding: 0.78125rem 1.5rem 0.78125rem;
      }
    }

    > .header:not(.ui) {
      background: #f5f5f5;
      font-size: 1.25rem !important;
      font-weight: normal;
      line-height: 1.25rem;
      padding: 1rem 1.5rem;

      > label {
        margin-top: 0.5rem;
      }
    }

    > :first-child:not(.icon) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    .description {
      margin: 1.5em 0;
      font-weight: 700;
    }
  }

  .ui.page.modals.transition.visible {
    display: flex !important;
  }

  .ui.progress {
    &.tiny {
      font-size: .5rem;
    }

    .bar {
      min-width: 0 !important;
    }
  }

  .ui.secondary.vertical.menu > .item {
    margin: 0;
  }

  .ui[class*="left icon"].input.left.icon > input {
    padding-left: 4rem !important;
  }

  .ui[class*="left icon"].input.left.icon > i.icon.big {
    left: -7px;
    opacity: 1;
  }

  .ui.button:disabled,
  .ui.buttons .disabled.button,
  .ui.disabled.active.button,
  .ui.disabled.button,
  .ui.disabled.button:hover {
    opacity: 0.2 !important;
  }

  /* modals aligned to top, not center */
  .ui.dimmer {
    justify-content: flex-start;
  }

  .ui.menu.tabular {
    border-color: #e6e6e6;
    /* break out of the wrapping main padding */
    margin: -1em -2em 0;
    overflow-x: scroll;
    padding: 2em 2em 0 2em;
    transition: padding-left 0.2s linear 0.4s;

    &::-webkit-scrollbar {
      display: none;
      width: 0px;
    }

    .item {
      border-bottom: 2px solid rgba(0, 0, 0, 0);
      border: none;
      top: -1px;

      &.active {
        background: none;;
        border-bottom: 2px solid #db2828;
      }
    }
  }

  /* remove the default white background, settings app has it as part of Tab */
  .ui.segment {
    background: transparent;
  }
`;
