import clientUtils from '../../utils/client-utils';
export default {
  getPdf(typeUrl, pdf) {
    let url;
    switch (typeUrl) {
      case 1:
        url = clientUtils.EMR_SIGNER_SERVICE;
        break;
      default:
        url = clientUtils.SUBCLINICAL_RESULT;
        break;
    }
    return clientUtils.requestApiFiles("get", `${url}files/${pdf}`, {});
  },
};
