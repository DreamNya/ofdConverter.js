# 说明
## 功能
Node.js用库，通过调用Java接口，将输入的ofd格式转换为目标格式输出。  
（Java接口已包装并编译，依赖Java运行时）
## 特点
- [x] 可解析任意ofd格式文件
- [x] 可输出多种格式：pdf/png/svg/html
- [x] 仅作中间接口，自由度高
- [x] 即开即用 易于使用
- [x] Java接口提供封装源码及编译后jar
## 原理
将Java库[ofdrw-converter](https://github.com/ofdrw/ofdrw/tree/master/ofdrw-converter)接口进行预先封装并编译为`.jar`，供Node.js调用。  
Node.js利用`child_process.spawn`与Java接口双向通信，将输入的ofd格式传输给Java接口并接收转换后的格式并输出。
## 已知问题
由于Java库[ofdrw-converter](https://github.com/ofdrw/ofdrw/tree/master/ofdrw-converter)解析时存在缺陷，故部分格式文件转换后可能存在瑕疵。  
本库仅封装编译，未对底层源码做任何改动，如有转换问题请向原库反馈。

# 使用方法
## 函数（d.ts）
```ts
/**
 * 通过调用Java将输入的ofd格式转换为目标输出格式
 * @param ofdInput ofd输入流
 * @param outputType 目标输出格式，默认pdf
 * @param arg json可选参数，具体参数查阅示例或Java源码
 * @return Promise<Buffer[]>
 */
export function ofdConverter(
    ofdInput: ReadableStream | Buffer,
    outputType: 'pdf' | 'png' | 'svg' | 'html',
    arg?: { [config: string]: any }
): Promise<Buffer[]>;
```
## 安装
### Java运行时
直接运行：JRE >= 8  
编译修改：JDK >= 8 & Maven

### NPM
```
npm install ofdconverter.js
```
## 使用（Node.js）
```js
const ofdConverter = require('ofdConverter.js');
const resultArray = await ofdConverter(ofdInpt, outputType, ?arg);
```
## 应用场景
详见[示例文件](example)

将ofd格式转换为pdf/png/svg/html格式  
[[ConverterAll.js]](example/ConverterAll.js)

将ofd格式先转换为png再转换为pdf格式  
[[OFDtoPNGtoPDF.js]](example/OFDtoPNGtoPDF.js)  
（解析格式不同，输出内容可能略有差异，详见[已知问题](#已知问题)。二次转换效果可能比直接转换更好）

# License
MIT
