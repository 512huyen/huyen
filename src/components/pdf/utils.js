import commons from './commons';
export const getFilePdf = async ({ typeUrl, pdf }) => {
  let data;
  if (pdf) {
    await commons.getPdf(typeUrl, pdf).then(async Response => {
      await Response.arrayBuffer().then(s => (data = s)).catch(() => null);
    }).catch((e) => console.log('pdf', e));
  }
  return data;
};
const getPdf = () => {
  if (pdf) {
    debugger
    pdf.arrayBuffer()
      // eslint-disable-next-line no-return-assign
      .then(s => setData({ ...data, pdf: s }))
      .catch((e) => console.log('pdf', e))
  }
};
export const print = async ({ pdf, typeUrl, isDownload }) => {
  if (!pdf) return;
  const Response = await getFilePdf({ pdf, typeUrl });
  const blob = new Blob([new Uint8Array(Response)], {
    type: 'application/pdf',
  });
  const blobUrl = window.URL.createObjectURL(blob);
  if (isDownload) {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = function (e) {
      const save = document.createElement('a');
      save.href = e.target.result;
      save.download = pdf || 'unknown file';
      save.style = 'display:none;opacity:0;color:transparent;';
      (document.body || document.documentElement).appendChild(save);
      if (typeof save.click === 'function') {
        save.click();
      } else {
        save.target = '_blank';
        const event = document.createEvent('Event');
        event.initEvent('click', true, true);
        save.dispatchEvent(event);
      }
      (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
  } else {
    const textEditor = document.getElementById('print-iframe');
    window.textEditor = document.getElementById('print-iframe');
    textEditor.src = blobUrl;
    textEditor.contentWindow.document.close();
    setTimeout(() => {
      textEditor.contentWindow.focus();
      textEditor.contentWindow.print();
    }, 200);
  }
};
