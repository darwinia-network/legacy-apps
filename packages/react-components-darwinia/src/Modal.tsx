// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';
import styled from 'styled-components';
import Button from './Button';
import ButtonCancel from './ButtonCancel';
import modalCloseIcon from './styles/images/modal-close.png';
import { BareProps } from './types';
import { classes } from './util';

interface ModalProps extends BareProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  subheader?: React.ReactNode;
  open?: boolean;
  [index: string]: any;
  onCancel?: () => void;
}

interface ActionsProps extends BareProps {
  cancelLabel?: string;
  children: React.ReactNode;
  withOr?: boolean;
  withCancel?: boolean;
  onCancel: () => void;
}

function Modal(props: ModalProps): React.ReactElement<ModalProps> {
  const { className, children, header, subheader, open = true, onCancel } = props;

  return (
    <SUIModal
      {...props}
      className={classes('theme--default', 'ui--Modal', className)}
      dimmer='inverted'
      header={undefined}
      open={open}
    >
      {header && (
        <SUIModal.Header>{header} <Subheader>{subheader}</Subheader></SUIModal.Header>
      )}
      {children}
      <img className="close-btn" src={modalCloseIcon} onClick={onCancel} />
    </SUIModal>
  );
}

function Actions({ cancelLabel, className, children, withOr = true, withCancel = true, onCancel }: ActionsProps): React.ReactElement<ActionsProps> {
  return (
    <SUIModal.Actions>
      <Button.Group className={className}>
        {/* {withOr && <Button.Or />} */}
        {children}
        {withCancel && <ButtonCancel label={cancelLabel} onClick={onCancel} />}
      </Button.Group>
    </SUIModal.Actions>
  );
}

const Subheader = styled.span`
  font-size: 12px;
  margin: 0 0 0 1em;
  white-space: no-wrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

Modal.Actions = Actions;
Modal.Content = SUIModal.Content;
Modal.Header = SUIModal.Header;
Modal.Description = SUIModal.Description;

export default Modal;
