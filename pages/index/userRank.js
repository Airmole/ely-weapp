const userRank = {
  title: {
  text: '弹幕活跃榜',
  left: 'center',
  textStyle: {
    color: '#000'
  }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    left: 'right',
    textStyle: {
      color: 'rgba(0,0,0,.5)',
      fontSize:'12',
    }
  },
  grid: {
    left: '0%',
    top:'40',
    right: '0%',
    bottom: '4%',
    containLabel: true
  },
  xAxis: {
  type: 'value'
  },
  yAxis: {
  type: 'category',
  boundaryGap: false,
  axisLabel:  {
    textStyle: {
      color: "rgba(0,0,0,.6)",
      fontSize:12,
    },
  },
  axisLine: {
    lineStyle: {
      color: 'rgba(255,255,255,.2)'
    }
  },
  data: []
  },
  series: [
  {
    name: '弹幕量/条',
    type: 'bar',
    label: { normal: { show: true, position: 'inside', color: '#fff' } },
    data: [],
    barWidth:'75%',
    itemStyle: {
        normal: {
        color:'#492D7F',
        opacity: 1,
        barBorderRadius: 3,
      }
    }
  }
  ]
};

module.exports = {
  userRank
}
