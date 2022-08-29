const userRank = {
  title: {
    text: '弹幕活跃榜',
    left: 'center',
    textStyle: {
      color: '#fff'
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
      color: 'rgba(255,255,255,.5)',
      fontSize: '12',
    }
  },
  grid: {
    left: '0%',
    top: '40',
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
    axisLabel: {
      textStyle: {
        color: "rgba(255,255,255,.6)",
        fontSize: 12,
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
      barWidth: '75%',
      itemStyle: {
        normal: {
          color: '#27d08a',
          opacity: 1,
          barBorderRadius: 3,
        }
      }
    }
  ]
}

const pieGraph = {
  backgroundColor: '#0E1B4B',
  grid: {
    height: '300px',
    containLabel: true
  },
  title: {
    text: '各用户弹幕占比', left: 'center', textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: "{a} {b}: {c} ({d}%)",
    position: function (p) {   //其中p为当前鼠标的位置
      return [p[0] + 10, p[1] - 10];
    }
  },
  series: [
    {
      name: '弹幕占比',
      type: 'pie',
      top: 50,
      center: ['50%', '42%'],
      radius: ['40%', '60%'],
      color: ['#065aab', '#066eab', '#0682ab', '#0696ab'],
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        }
      }
    }
  ]
};

const timeLine = {
  backgroundColor: '#0E1B4B',
  color: ['#80FFA5'],
  title: {
    text: '每小时弹幕数', left: 'center', textStyle: {
      color: '#fff'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    height: '200px',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: [{ type: 'value' }],
  series: [
    {
      name: '弹幕量',
      type: 'line',
      stack: 'Total',
      smooth: true,
      label: {
        show: true,
        position: 'top'
      },
      lineStyle: { width: 0 },
      showSymbol: false,
      areaStyle: {
        opacity: 0.8,
        color: '#61D48E'
      },
      emphasis: { focus: 'series' },
      data: []
    }
  ]
};

module.exports = {
  userRank,
  timeLine,
  pieGraph
}