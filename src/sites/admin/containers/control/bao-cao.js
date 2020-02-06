import React from 'react';
import '../../../admin/css/export-file.css'
const jsPDF = require('jspdf');
const html2canvas = require('html2canvas');
const $ = require('jquery');
// import './font-times-new-roman-normal.js'
class PrintTicketExport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    componentDidMount() {
        var pdf = new jsPDF('p', 'pt', 'a4');
        var source = $('#customers')[0];

        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        var specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        }
        var margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
        pdf.fromHTML(
            source, // HTML string or DOM elem ref.
            margins.left, // x coord
            margins.top, {// y coord
            'width': margins.width, // max width of content on PDF
            'elementHandlers': specialElementHandlers
        },
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF 
                //          this allow the insertion of new lines after html
                pdf.setFont('font-times-new-roman', 'normal');
                pdf.save('Test.pdf');
            }
            , margins);
        ///////////////////////

        // Example From https://parall.ax/products/jspdf
        // var doc = new jsPDF('p', 'pt');

        // doc.text(20, 20, 'This is the default font.')

        // doc.setFont('courier')
        // doc.setFontType('normal')
        // doc.text(20, 30, 'This is courier normal.')

        // doc.setFont('times')
        // doc.setFontType('italic')
        // doc.text(20, 40, 'This is times italic.')

        // doc.setFont('helvetica')
        // doc.setFontType('bold')
        // doc.text(20, 50, 'This is helvetica bold.')

        // doc.setFont('courier')
        // doc.setFontType('bolditalic')
        // doc.text(20, 841, 'This is courier bolditalic.')

        // // Save the Data
        // doc.save('Generated.pdf')

        // var doc = new jsPDF('p', 'pt', 'a4');
        // doc.text(10, 10, "ahihihi")
        // doc.addPage(595.28, 841.89);
        // doc.internal.getNumberOfPages();
        // doc.setPage();
        // doc.save('html.pdf');


        //////////////////////////

        // 
        // let doc = new jsPDF('p', 'pt', 'a4');
        // // doc.addHTML(document.body, function () {
        // //     let data = document.body.outerText
        // //     let data2 = document.body.textContent
        // //     // doc.addPage(595.28, 841.89);
        // //     // doc.autoPrint()
        // // });
        // var pdf = new jsPDF('p', 'pt', 'letter');
        // debugger
        // pdf.canvas.height = 72 * 11;
        // pdf.canvas.width = 72 * 8.5;

        // pdf.fromHTML(document.body);
        // doc.save('Bao_cao_doi_soat.pdf')
        // setTimeout(() => {
        //     window.print();
        // }, 500)
    }
    render() {
        return (
            <div style={{ position: "relative", padding: 70 }} id="customers">
                <div style={{ display: "flex" }}>
                    <div style={{ textAlign: "center", textTransform: "uppercase" }}>
                        <div style={{ fontSize: 18 }}>Bộ y tế</div>
                        <div style={{ fontSize: 18, fontWeight: 600 }}>Bệnh viện đại học y hà nội</div>
                    </div>
                </div>
                <div style={{ textAlign: "center", paddingTop: 30 }}>
                    <div style={{ textTransform: "uppercase", fontSize: 28, fontWeight: 700 }}>Báo cáo đối soát</div>
                    <div style={{ fontSize: 20 }}> Từ 00:00:00 ngày 05/12/2019 đến 23:59:59 ngày 05/12/2019</div>
                    <div style={{ fontWeight: 600, fontSize: 20 }}>Nhà cung cấp DV: Viettinbank</div>
                </div>
                <div style={{ paddingTop: 35 }}>
                    <div style={{ display: "flex", paddingBottom: 5 }}>
                        <div style={{ marginLeft: "auto", fontSize: 18 }}>Đơn vị: đồng</div>
                    </div>
                    <table cellSpacing="0">
                        <thead>
                            <tr>
                                <td style={{ fontSize: 20 }}>STT</td>
                                <td style={{ fontSize: 20 }}>Số thẻ</td>
                                <td style={{ fontSize: 20 }}>Số tiền</td>
                                <td style={{ fontSize: 20 }}>Mã giao dịch TT</td>
                                <td style={{ fontSize: 20 }}>Mã giao dịch hoàn</td>
                                <td style={{ fontSize: 20 }}>Mã hạch toán Viettinbank</td>
                                <td style={{ fontSize: 20 }}>Thời gian GD</td>
                                <td style={{ fontSize: 20 }}>Mã kết quả đối soát</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr> <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>

                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>1.000.000</td>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Lương Thị Yến</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>2165553221</td>
                                <td>10.000.000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style={{ marginTop: 20, fontWeight: 600 }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ fontSize: 20 }}>Tổng giao dịch: </div>
                        <div style={{ paddingLeft: 10, fontSize: 20 }}>10</div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ fontSize: 20 }}>Số giao dịch đúng:: </div>
                        <div style={{ paddingLeft: 10, fontSize: 20 }}>10</div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ fontSize: 20 }}>Số giao dịch lệch: </div>
                        <div style={{ paddingLeft: 10, fontSize: 20 }}>10</div>
                    </div>
                </div>
                <div>
                    <table cellSpacing="0" style={{ marginTop: 50, border: "none" }}>
                        <thead style={{ fontWeight: "normal" }}>
                            <tr style={{ border: "none" }}>
                                <td style={{ width: "60%", border: "none" }}></td>
                                <td style={{ width: "40%", border: "none" }}>Ngày 06 tháng 09 năm 2019</td>
                            </tr>
                        </thead>
                        <tbody style={{ fontWeight: 600 }}>
                            <tr style={{ border: "none" }}>
                                <td style={{ border: "none", backgroundColor: "#fff" }}></td>
                                <td style={{ width: "40%", border: "none", backgroundColor: "#fff" }}>Người lập</td>
                            </tr>
                        </tbody>
                        <tfoot >
                            <tr style={{ border: "none" }}>
                                <td style={{ border: "none" }}></td>
                                <td style={{ border: "none" }}>(Ký tên)</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                {/* <div className="footer" style={{ position: "fixed", bottom: 0, marginRight: 50, display: "flex", width: "100%" }}>
                    <div style={{ fontSize: 12 }}>
                        ISOFH - <span style={{ fontStyle: "italic" }}>Người in: admin, ngày in 06/09/2019 14:10</span>
                    </div>
                    <div style={{ marginLeft: "auto", marginRight: 140 }}>
                        1/1
                    </div>
                </div> */}
            </div>
        )
    }
}

export default PrintTicketExport;