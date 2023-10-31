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
