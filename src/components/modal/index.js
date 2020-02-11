import React, { Children } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import './index.scss';
import Clear from '@material-ui/icons/Clear';
import IconButton from '@material-ui/core/IconButton';
import Button from '../button'
function getModalStyle(item, item2) {
  return {
    top: `10%`,
    left: `50%`,
    transform: `translate(-50%, -0)`,
    width: item,
    paddingLeft: item2,
    paddingRight: item2 + 15,
  };
}
function getModalStyleButton(item) {
  return {
    marginRight: -item
  };
}
const styles = theme => ({
  paper: {
    position: 'absolute',
    width: '100%',
    overflowY: 'scroll',
    maxHeight: "calc(100% - 96px)",
    display: 'flex',
    // alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff',
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
    borderRadius: 4,
    overflowY: "auto",
    boxShadow: "0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12)",
  },
  title: {
    textAlign: "center",
    paddingBottom: 18
  }
});
function SimpleModal({ classes, Children, isOpen, toggle, title, buttonFooter, width, padding, popupDetail }) {
  const [modalStyle] = React.useState(getModalStyle(width, padding));
  const [modalStyleButton] = React.useState(getModalStyleButton(padding));
  return (
    <>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={isOpen}
        onClose={toggle}
      >
        <div style={modalStyle} className={classes.paper + " modal-create-update"}  >
          <div className="title-popup">
            <IconButton onClick={toggle} color="primary" style={modalStyleButton} className={classes.button + " close-button"} aria-label="CancelIcon">
              <Clear />
            </IconButton>
            <div className={classes.title}>{title}</div>
          </div>
          {
            popupDetail ?
              <div className="group-detail">
                {Children}
              </div> :
              <div className="popup-body">
                {Children}
              </div>
          }

          <div className="popup-footer">
            <div className="row">

            </div>
            {buttonFooter}
          </div>
        </div>
      </Modal>
    </>
  );
}

export default withStyles(styles)(SimpleModal);
