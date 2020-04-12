import React from 'react';
import { print } from '@components/pdf/utils';
import PropTypes from 'prop-types';
import { Button, Modal } from 'antd';
import Pdf from '@components/pdf/index';
import { connect } from 'react-redux';
import '../style.scss';
import clientUtils from '../../../../../utils/client-utils';
const ShowPdfModal = props => {
  const { toggle, isOpenModal, pdf } = props;

  return (
    <Modal
      width={600}
      keyboard
      title={
        <>
          <div className="title-header">Chi tiết</div>
          <Button
            onClick={() => print({ pdf, typeUrl: 1 })}
            width="72px" className="download" >in</Button>
        </>
      }
      visible={isOpenModal}
      onCancel={toggle}
      onOk={toggle}
      className="detail-file"
      footer={[
        <></>
      ]} >
      {/* <Pdf pdf={pdf} typeUrl={1} showPrint /> */}
      <iframe src={'https://docs.google.com/viewer?url=' + `${clientUtils.EMR_SIGNER_SERVICE}files/${pdf}` + '&embedded=true'} height="100%" width="100%"></iframe>
    </Modal >
  );
};

ShowPdfModal.propTypes = {
  isOpenModal: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  pdf: PropTypes.string.isRequired,
};

export default connect(
  null,
  null,
)(ShowPdfModal);
