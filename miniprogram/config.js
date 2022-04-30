var data = {
      //云开发环境id
      env: 'cloud1-7gg95toua8c7bcf8',
      //分享配置
      share_title: 'QUST二手交易',
      share_img: '/images/poster.jpg', //可以是网络地址，本地文件路径要填绝对位置
      share_poster:'https://mmbiz.qpic.cn/mmbiz_jpg/nJPznPUZbhpA064Cl78xxvzBYTDa6O1Kl7RY1K6TerBaXcUf5AoN6x7s8q7xHgeu0Cl5qarPzE6ibbQZasWRErg/640',//必须为网络地址
      //客服联系方式
      kefu: {
            weixin: 'ljh554974',
            qq: '1574447086',
      },
      //可以是网络地址，本地文件路径要填绝对位置
      bgurl: '/images/startBg.jpg',
      //校区
      campus: [{
                  name: '崂山校区',
                  id: 0
            },
            {
                  name: '四方校区',
                  id: 1
            },
            {
                  name: '高密校区',
                  id: 2
            },
            {
                  name: '中德校区',
                  id: 3
            },
      ],
      //一级商品分类
      sort1:['通用','教材','考研','考证','四六级','考公考编','教资','竞赛','课外读物'],
      sort: [{
                  name: '通用',
                  id: 0
            },
            {
                  name: '教材',
                  id: 1
            },
            {
                  name: '考研',
                  id: 2
            },
            {
                  name: '考证',
                  id: 3
            },
            {
                  name: '四六级',
                  id: 4
            },
            {
                  name: '考公',
                  id: 5
            },
            {
                  name: '教资',
                  id: 6
            },
            {
                  name: '竞赛',
                  id: 7
            },
            {
									name: '课外',
									id: 8
            },

      ],
}
//下面的就别动了
function formTime(creatTime) {
      let date = new Date(creatTime),
            Y = date.getFullYear(),
            M = date.getMonth() + 1,
            D = date.getDate(),
            H = date.getHours(),
            m = date.getMinutes(),
            s = date.getSeconds();
      if (M < 10) {
            M = '0' + M;
      }
      if (D < 10) {
            D = '0' + D;
      }
      if (H < 10) {
            H = '0' + H;
      }
      if (m < 10) {
            m = '0' + m;
      }
      if (s < 10) {
            s = '0' + s;
      }
      return Y + '-' + M + '-' + D + ' ' + H + ':' + m + ':' + s;
}

function days() {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      if (month < 10) {
            month = '0' + month;
      }
      if (day < 10) {
            day = '0' + day;
      }
      let date = year + "" + month + day;
      return date;
}
module.exports = {
      data: JSON.stringify(data),
      formTime: formTime,
      days: days
}