const { spawn } = require('child_process');
const { Stream } = require('stream');

module.exports = function ofdConverter(ofdInput, outputType = 'pdf', arg = {}) {
    return new Promise((resolve, reject) => {
        /* 
            child_process调用jar 
            spawn能实时控制输入输出流；exec输出流会在转换结束后一次性强制转换为字符串输出 #坑
        */
        const javaProcess = spawn(
            'java',
            [
                '-jar',
                __dirname + '/../lib/target/ofdConverter-1.0-jar-with-dependencies.jar',
                outputType,
                JSON.stringify(arg),
            ],
            { maxBuffer: 1024 * 10000 }
        );
        
        javaProcess.stderr.on('data', (data) => {
            console.error(data);
        });

        const bufferData = [];
        const bufferResult = [];
        // 实时接收二进制流并存储入数组
        javaProcess.stdout.on('data', (chunk) => {
            //console.log(chunk);
            if (typeof chunk != 'string') {
                // 判断是否写入完成
                if (chunk.length == 4 && chunk.every((i) => i == 255)) {
                    //console.log(chunk);
                    // 拼接写入完成的Buffer 输出到数组结果
                    bufferResult.push(Buffer.concat(bufferData));
                    // 清空拼接完成的Buffer
                    bufferData.length = 0;
                } else {
                    // 写入Buffer流
                    bufferData.push(chunk);
                }
            }
        });

        // Java退出后拼接二进制流并返回
        javaProcess.on('exit', (code) => {
            if (code == 0) {
                resolve(bufferResult);
            } else {
                reject(`Java 退出异常：${code}`);
            }
            console.log(`Java 退出代码：${code}`);
        });

        if (Buffer.isBuffer(ofdInput)) {
            // Buffer输入
            javaProcess.stdin.write(ofdInput);
        } else if (Stream.isReadable(ofdInput)) {
            // Stream输入
            ofdInput.pipe(javaProcess.stdin);
        }
    });
};