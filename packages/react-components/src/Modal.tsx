// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIModal from 'semantic-ui-react/dist/commonjs/modules/Modal/Modal';

import Button from './Button';
import ButtonCancel from './ButtonCancel';
import { classes } from './util';
import modalCloseIcon from './styles/images/modal-close.png';

interface ModalProps extends BareProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  open?: boolean;
  [index: string]: any;
  onCancel?: () => void;
}

interface ActionsProps extends BareProps {
  cancelLabel?: string;
  children: React.ReactNode;
  withOr?: boolean;
  onCancel: () => void;
}

function Modal (props: ModalProps): React.ReactElement<ModalProps> {
  const { className, children, header, open = true, onCancel } = props;

  return (
    <SUIModal
      {...props}
      className={classes('theme--default', 'ui--Modal', className)}
      dimmer='inverted'
      header={undefined}
      open={open}
    >
      {header && (
        <SUIModal.Header>{header}</SUIModal.Header>
      )}
      {children}
      <img className="close-btn" src={modalCloseIcon} onClick={onCancel} />
    </SUIModal>
  );
}

function Actions ({ cancelLabel, className, children, withOr = true, onCancel }: ActionsProps): React.ReactElement<ActionsProps> {
  return (
    <SUIModal.Actions>
      <Button.Group className={className}>
        {/* {withOr && <Button.Or />} */}
        {children}
        <ButtonCancel label={cancelLabel} onClick={onCancel} />
      </Button.Group>
    </SUIModal.Actions>
  );
}

Modal.Actions = Actions;
Modal.Content = SUIModal.Content;
Modal.Header = SUIModal.Header;
Modal.Description = SUIModal.Description;

export default Modal;
