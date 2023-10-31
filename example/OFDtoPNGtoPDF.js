const ofdConverter = require('../src/ofdConverter.js');
const fs = require('fs');
const path = require('path');

const { PDFDocument } = require('pdf-lib');
const { PNG } = require('pngjs');

(async () => {
    const ofd = fs.ReadStream(path.join(__dirname, '../test/input/test.ofd'));
    // 图片精度 - 精度越大，输出的图片越大，质量越好
    const ppm = 30;
    const scale = ppm / 4.5;
    const bufferArray = await ofdConverter(ofd, 'png', { ppm });
    const pdfDoc = await PDFDocument.create();
    bufferArray.forEach(async (buffer, index) => {
        //fs.writeFileSync(path.join(__dirname, `../test/output/test${index}.png`), buffer);
        // 读取PNG信息
        const png = PNG.sync.read(buffer);
        const { width, height } = png;

        // 创建一个页面
        const page = pdfDoc.addPage();

        // 为页面设置宽度和高度（以像素为单位）
        page.setSize(width / scale, height / scale);

        // 将PNG图像绘制到PDF页面
        const pngImage = await pdfDoc.embedPng(buffer);
        page.drawImage(pngImage, {
            x: 0,
            y: 0,
            width: width / scale,
            height: height / scale,
        });
    });

    // 将PDF保存到文件
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(path.join(__dirname, '../test/output/ofd2png2pdf.pdf'), pdfBytes);
})();
