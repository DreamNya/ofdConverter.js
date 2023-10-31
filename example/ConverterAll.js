const ofdConverter = require('../src/ofdConverter.js');
const fs = require('fs');
const path = require('path');

const ofd = fs.ReadStream(path.join(__dirname, '../test/input/test.ofd'));

png();
pdf();
svg();
html_file();
html_string();

async function png() {
    const ppm = 30;
    const buffers = await ofdConverter(ofd, 'png', { ppm });
    buffers.forEach((buffer, index) => {
        fs.writeFileSync(path.join(__dirname, `../test/output/test${index}.png`), buffer);
    });
}

async function pdf() {
    const buffers = await ofdConverter(ofd, 'pdf');
    fs.writeFileSync(path.join(__dirname, `../test/output/test.pdf`), buffers[0]);
}

async function svg() {
    // svg精度（html原理为先转svg再转html）
    const ppm = 10;
    const buffers = await ofdConverter(ofd, 'svg', { ppm });
    buffers.forEach((buffer, index) => {
        fs.writeFileSync(path.join(__dirname, `../test/output/test${index}.svg`), buffer);
    });
}

// 直接输出html到指定路径文件 （如要Buffer，需要手动fs读取）
async function html_file() {
    // 输出路径（绝对路径）
    const htmlPath = path.join(__dirname, `../test/output/html_file.html`);
    // 页面宽度
    const width = 1000;
    await ofdConverter(ofd, 'html', { path: htmlPath, width });
}

// 以Buffer输出html 多页html会输出为多个HTML 需要修改样式后手动合并
async function html_string() {
    // 页面宽度
    const width = 1000;
    // svg精度（html原理为先转svg再转html）
    const ppm = 10;
    const buffers = await ofdConverter(ofd, 'html', { width, ppm });
    buffers.forEach((buffer, index) => {
        fs.writeFileSync(path.join(__dirname, `../test/output/test${index}.html`), buffer);
    });
}
