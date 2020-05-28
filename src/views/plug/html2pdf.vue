<template>
  <el-main>
    <div class="pageTitMod" style="border: 0px solid #FAECD8; background-color: #D9ECFF;padding: 0 10px;position: fixed;z-index: 100;">
      <el-row >
        <el-col v-show="drawer" :span="12">
          <el-select v-model="value" placeholder="请选择" @change="initPage(value)">
            <el-option
              v-for="(item,index) in options"
              :key="index"
              :label="item.orgName"
              :value="index">
            </el-option>
          </el-select>
        </el-col>
        <el-col v-show="drawer" :span="10">
          <el-button v-show="downloadFlag" type="text" @click="downLoad()"><i class="el-icon-download"  style="margin-right: 5px;"></i>下载PDF</el-button>
<!--          <el-button v-show="downloadFlag" id="downLoadPdf" type="text" @click="downLoadPdf()"><i class="el-icon-download"  style="margin-right: 5px;"></i>下载PDF</el-button>-->
        </el-col>
        <el-col :span="2">
          <el-button :icon="'fa fa-chevron-'+(drawer?'left':'right')" @click="drawer = !drawer" style="background-color: rgb(217, 236, 255);"></el-button>
        </el-col>
      </el-row>
    </div>
    <div id="pdfHtml" style="width: 794px;margin: auto;background: #fff;">
      <div class="A4">
        <span class="pull-right" style="padding-top: 10%;padding-right: 20px;">课题编号：2017YFC1310901</span>
        <h1 style="padding: 30% 5% 20%;text-align: center;line-height: 50px;">
          国家科技部“十三五”重点研发计划<br/>基于医院信息化系统的脑血管病医疗质量<br/>评价与改进平台数据质量报告
        </h1>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="9"><h3 class="pull-right">中心名称：</h3></el-col>
          <el-col :span="15"><h3 class="pull-left"><u>{{options[value].orgName}}</u></h3></el-col>
        </el-row>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="9"><h3 class="pull-right">报告时间：</h3></el-col>
          <el-col :span="15"><h3 class="pull-left"><u>2020年5月28日</u></h3></el-col>
        </el-row>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="9"><h4 class="pull-right">牵头单位：</h4></el-col>
          <el-col :span="15"><h4 class="pull-left"><u>首都医科大学附属北京天坛医院</u></h4></el-col>
          <el-col :span="9" style=""><h4 class="pull-right">：</h4></el-col>
          <el-col :span="15"><h4 class="pull-left"><u>国家神经系统疾病临床研究中心</u></h4></el-col>
        </el-row>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="9"><h4 class="pull-right">项目负责人：</h4></el-col>
          <el-col :span="15"><h4 class="pull-left"><u>李子孝</u></h4></el-col>
        </el-row>
        <el-row style="margin-bottom: 40px;">
          <el-col :span="9"><h4 class="pull-right">执行期限：</h4></el-col>
          <el-col :span="15"><h4 class="pull-left"><u>2019 年2月 至 2020 年12 月</u></h4></el-col>
        </el-row>
      </div>
    </div>
  </el-main>
</template>

<script>
  import html2Canvas from 'html2canvas'
  import JsPDF from 'jspdf'
  import warterMark from '@/utils/warterMark'
    export default {
      name: "html2pdf",
        data () {
          return {
              options: [
                  {
                      pkId: 1,
                      orgName: '机构1'
                  },{
                      pkId: 2,
                      orgName: '机构2'
                  },{
                      pkId: 3,
                      orgName: '机构3'
                  },{
                      pkId: 4,
                      orgName: '机构4'
                  },{
                      pkId: 5,
                      orgName: '机构5'
                  },{
                      pkId: 6,
                      orgName: '机构6'
                  },
              ],
              value: 0,
              drawer: true,
              downloadFlag: true,
          }
        },
        mounted () {
            warterMark.set('页面转pdf','pdfHtml');
        },
        methods: {
            //下载
            downLoad (id) {
                // $("#water").height($("#pdfHtml").height());
                let _this = this;
                html2Canvas(document.getElementById("pdfHtml"), {
                    allowTaint: true,
                    // taintTest: false,
                    scale: 2,
                }).then(function (canvas) {
                    document.body.appendChild(canvas);
                    return;
                    let title = _this.options[_this.value].orgName +"数据质量报告-"+ new Date();
                    let a4_w = 595.28;
                    let a4_h = 841.89;
                    let contentWidth = canvas.width;
                    let contentHeight = canvas.height;
                    //一页pdf显示html页面生成的canvas高度;
                    let pageHeight = contentWidth / a4_w * a4_h;
                    //未生成pdf的html页面高度
                    let leftHeight = contentHeight;
                    //页面偏移
                    let position = 0;
                    //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
                    let imgWidth = a4_w;
                    let imgHeight = a4_w / contentWidth * contentHeight;
                    let pageData = canvas.toDataURL('image/jpeg', 1.0);
                    let PDF = new JsPDF('', 'pt', 'a4');

                    //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
                    //当内容未超过pdf一页显示的范围，无需分页
                    if (leftHeight < pageHeight) {
                        PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
                    } else {
                        while (leftHeight > 0) {
                            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                            leftHeight -= pageHeight;
                            position -= a4_h;
                            //避免添加空白页
                            if (leftHeight > 0) {
                                PDF.addPage();
                            }
                        }
                    }
                    PDF.save(title+".pdf");
                });
            },
        }
    }
</script>

<style scoped>
  .A4{
    width: 794px;
    height: 1120px;
    /*margin: auto;*/
    /*margin-bottom: 5px;*/
    /*padding: 0;*/
  }
  .border {
    background-color: #fff;
    border-radius: 5px;
    padding: 20px;
    /*overflow: hidden;*/
  }

  .portletTit {
    padding: 8px 0 8px 10px;
    margin-bottom: 8px;
    font-size: 15px;
    border-bottom: 1px solid #f1f1f1;
  }

  .portletTit > i {
    margin-right: 6px;
    font-style: italic;
    color: #bbbbbb;
    font-size: 15px;
  }

  .switchBox .el-button {
    border-color: #DCDFE6;
    color: #666;
  }

  .switchBox .el-button:hover {
    border-color: #3a9aff;
    color: #229af2;
  }

  .switchBox .el-button.active {
    color: #fff;
  }

  .chartList {
    /*border:1px solid #DCDFE6;*/
    /*margin-top: -1px;*/
  }

  .switchBox.el-button-group > .el-button:first-child, .switchBox.el-button-group > .el-button:last-child {
    border-radius: 0;
  }

  #pdfHtml{
    color: black;
  }

  #chart3 {
    height: 350px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-flow: wrap;
    position: relative;
  }
  #chart3 div{
    width:30px;
    height:30px;
    margin:10px;
    border-radius: 5px;
    background-color: rgba(237, 236, 241, 0.38);
  }
  #chart3 div.pass{
    background-color: rgba(0, 239, 122, 0.12);
  }
  #roleInfo>li{
    width:100%;
    margin-bottom: 15px;
  }
  #roleInfo>li>span:first-child{
    text-align: right;
    width: 80px;
    padding-right: 5px;
  }
  #roleInfo>li>span:last-child{
    width: calc(100% - 80px);
    padding:0 10px;
  }
  .statBox .stat:nth-child(1) {
    background-image: linear-gradient(230deg, #0e4cfd, #6a8eff);
  }
  .statBox .stat:nth-child(2) {
    background-image: linear-gradient(230deg, #820398, #b185f7);
  }
  .statBox .stat:nth-child(3) {
    background-image: linear-gradient(230deg, #de0045, #ff8579);
  }
  .statBox .stat:nth-child(4) {
    background-image: linear-gradient(230deg, #dc7600, #e89876);
  }
  .statBox .stat:nth-child(5) {
    background-image: linear-gradient(230deg, #048eaf, #85b2c7);
  }
  .statBox .stat:nth-child(6) {
    background-image: linear-gradient(230deg, #03ca73, #90bf7b);
  }
  >>>.el-progress-bar__outer{
    background-color: #c3c3c3;
  }
  >>>.el-table .cell{
    color: black;
  }
  >>>.statBox .stat div.display {
    padding-right: 0px;
  }
  .card .card-body {
    padding: 2rem 1rem;
    background: #fff;
  }
</style>
