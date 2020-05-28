
'use strict'

let watermark = {}

let setWatermark = (str,dom) => {
  let id = 'water';
  dom = document.getElementById(dom);
  if (dom == null || document.getElementById(id) != null) {
    return
  }
  if (document.getElementById(id) !== null) {
    // document.body.removeChild(document.getElementById(id));
    $("#"+id).empty();
  }

  let can = document.createElement('canvas');
  can.width = 300;
  can.height = 120;

  let cans = can.getContext('2d');
  cans.rotate(-20 * Math.PI / 180);
  cans.font = '20px Vedana';
  cans.fillStyle = 'rgba(200, 200, 200, 0.40)';
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  // cans.fillText(str, can.width / 3, can.height / 2);

  let chr = str.split("");
  let temp = "";
  let row = [];
  let w = 120;
  for(var a = 0; a < chr.length; a++){
    if( cans.measureText(temp).width < w && cans.measureText(temp+(chr[a])).width <= w){
      temp += chr[a];
    }//context.measureText(text).width  测量文本text的宽度
    else{
      row.push(temp);
      temp = chr[a];
    }
  }
  row.push(temp);
  for(var b = 0; b < row.length; b++){
    cans.fillText(row[b],0,30+(b+1)*24);//字体20，间隔24。类似行高
  }

  let div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '30px';
  // div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '1000';
  div.style.width = dom.clientWidth + 'px';
  div.style.height = dom.clientHeight + 'px';
  div.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  // dom.style.background = 'url(' + can.toDataURL('image/png') + ') left top repeat';
  dom.appendChild(div);
  // document.body.appendChild(div);
  return id
};

// 该方法只允许调用一次
watermark.set = (str,dom) => {
  let id = setWatermark(str,dom);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str,dom)
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str,dom);
  }
}

export default watermark
