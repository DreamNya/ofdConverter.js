package work.ofdConverter;

import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

import org.json.JSONObject;
import org.ofdrw.converter.ConvertHelper;
import org.ofdrw.converter.FontLoader;
import org.ofdrw.converter.ImageMaker;
import org.ofdrw.converter.SVGMaker;
import org.ofdrw.reader.OFDReader;
import org.ofdrw.converter.HtmlMaker;

public class Main {
    public static void main(String[] args) throws IOException {

        // 为不规范的字体名创建映射
        FontLoader.getInstance()
                .addAliasMapping("小标宋体", "方正小标宋简体")
                .addAliasMapping("KaiTi_GB2312", "楷体")
                .addAliasMapping("楷体", "KaiTi")
                .addSimilarFontReplaceRegexMapping(".*Kai.*", "楷体")
                .addSimilarFontReplaceRegexMapping(".*Kai.*", "楷体")
                .addSimilarFontReplaceRegexMapping(".*MinionPro.*", "SimSun")
                .addSimilarFontReplaceRegexMapping(".*SimSun.*", "SimSun")
                .addSimilarFontReplaceRegexMapping(".*Song.*", "宋体")
                .addSimilarFontReplaceRegexMapping(".*MinionPro.*", "SimSun");

        // FontLoader.getInstance().scanFontDir(new File("src/main/resources/fonts"));
        FontLoader.setSimilarFontReplace(true);

        if (args.length > 0) {
            String type = args[0].toLowerCase();
            JSONObject json = new JSONObject(args[1]);
            switch (type) {
                case "pdf": {
                    ConvertHelper.toPdf(System.in, System.out);
                    // 代表末尾输出完毕，用于分割二进制流
                    System.out.write(new byte[] { -1, -1, -1, -1 });
                    break;
                }
                case "png": {
                    // png精度
                    int ppm = json.optInt("ppm", 30);
                    OFDReader reader = new OFDReader(System.in);
                    ImageMaker imageMaker = new ImageMaker(reader, ppm);
                    imageMaker.config.setDrawBoundary(false);
                    for (int i = 0; i < imageMaker.pageSize(); i++) {
                        BufferedImage image = imageMaker.makePage(i);
                        // 输出单张图片
                        ImageIO.write(image, "PNG", System.out);
                        // 代表末尾输出完毕，用于分割二进制流
                        System.out.write(new byte[] { -1, -1, -1, -1 });
                    }
                    break;
                }
                case "html": {
                    // 绝对路径
                    String path = json.optString("path", "");
                    // 页面宽度
                    int width = json.optInt("width", 1000);
                    OFDReader reader = new OFDReader(System.in);
                    if (path != "") {
                        // 有路径则输出html文件
                        HtmlMaker htmlMaker = new HtmlMaker(reader, Paths.get(path), width);
                        htmlMaker.parse();
                        // 代表末尾输出完毕，用于分割二进制流
                        System.out.write(new byte[] { -1, -1, -1, -1 });
                    } else {
                        // 无路径则输出html字符串 多页ofd存在样式问题 需要手动修改 待改进
                        // svg精度
                        double ppm = json.optDouble("ppm", 10d);
                        HtmlMaker htmlMaker = new HtmlMaker(reader, width);
                        SVGMaker svgMaker = new SVGMaker(reader, ppm);
                        for (int i = 0; i < reader.getNumberOfPages(); i++) {
                            String html = htmlMaker.makePageDiv(svgMaker, i);
                            System.out.write(html.getBytes());
                            // 代表末尾输出完毕，用于分割二进制流
                            System.out.write(new byte[] { -1, -1, -1, -1 });
                        }
                    }
                    break;
                }
                case "svg": {
                    // svg精度
                    double ppm = json.optDouble("ppm", 10d);
                    OFDReader reader = new OFDReader(System.in);
                    SVGMaker svgMaker = new SVGMaker(reader, ppm);
                    svgMaker.config.setDrawBoundary(false);
                    svgMaker.config.setClip(false);
                    for (int i = 0; i < svgMaker.pageSize(); i++) {
                        String svg = svgMaker.makePage(i);
                        System.out.write(svg.getBytes());
                        // 代表末尾输出完毕，用于分割二进制流
                        System.out.write(new byte[] { -1, -1, -1, -1 });
                    }
                    break;
                }
                case "test": {
                    break;
                }
                default: {
                    System.out.print("Error type");
                }
            }
        } else {
            System.out.print("Missing type");
        }
    }

}