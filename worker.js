
self.addEventListener('message', function (event) {
  let excelBinaryData = event.data;
  let getExcelList = [];
  let appliedBrand = {
    '奥迪': [0, 0, 0, 0],
    '宝马': [0, 0, 0, 0],
    '保时捷': [0, 0, 0, 0],
    '大发': [0, 0, 0, 0],
    '大众': [0, 0, 0, 0],
    '大众，通用': [0, 0, 0, 0],
    '大众、红旗': [0, 0, 0, 0],
    '东风标致': [0, 0, 0, 0],
    '广汽本田': [0, 0, 0, 0],
    '广汽菲克': [0, 0, 0, 0],
    '广汽丰田': [0, 0, 0, 0],
    '海马': [0, 0, 0, 0],
    '吉利': [0, 0, 0, 0],
    '吉利，陆风': [0, 0, 0, 0],
    '吉利、福特': [0, 0, 0, 0],
    '康明斯': [0, 0, 0, 0],
    '猎豹': [0, 0, 0, 0],
    '陆虎': [0, 0, 0, 0],
    '马自达': [0, 0, 0, 0],
    '尼桑': [0, 0, 0, 0],
    '奇瑞': [0, 0, 0, 0],
    '日本三菱': [0, 0, 0, 0],
    '上柴': [0, 0, 0, 0],
    '上汽': [0, 0, 0, 0],
    '上汽、大众、通用': [0, 0, 0, 0],
    '台湾华创': [0, 0, 0, 0],
    '特斯拉': [0, 0, 0, 0],
    '通用汽车': [0, 0, 0, 0],
    '潍柴': [0, 0, 0, 0],
    '蔚来汽车': [0, 0, 0, 0],
    '一汽轿车': [0, 0, 0, 0],
    '长安福特': [0, 0, 0, 0],
    '长城汽车': [0, 0, 0, 0]
  };

  // 获取excel所有元素
  for (let sheet in excelBinaryData.Sheets) {
    if (excelBinaryData.Sheets.hasOwnProperty(sheet)) {
      let excelSheet = XLSX.utils.sheet_to_json(excelBinaryData.Sheets[sheet]);
      getExcelList[getExcelList.length] = excelSheet;
    }
  }

  let newExcelList = [];
  let totalSum = 0;
  console.log("===getExcelList::")
  console.log(getExcelList)

  // 累加各个应用品牌的开出未税金额和毛利
  for (let i = 1; i < getExcelList[0].length; i++) {
    let item = getExcelList[0][i];

    if (item[' 开出未税金额 '] != undefined) {
      totalSum += item[' 开出未税金额 '];
    }

    if (item['行业分类'] == '汽车类' && item['标准分类'] == '功能异形件' && item['应用品牌'] != '通用件') {
      appliedBrand[item['应用品牌']][0] += item[' 开出未税金额 '];
      appliedBrand[item['应用品牌']][1] += item['*毛利*'];
    }
  }

  // 计算各个应用品牌的开出未税金额占比和毛利/开出未税金额
  for (let key in appliedBrand) {
    appliedBrand[key][2] = appliedBrand[key][0] / totalSum;
    appliedBrand[key][3] = appliedBrand[key][1] / appliedBrand[key][0];

    let newItem = {};
    newItem['应用品牌'] = key;
    newItem['应用品牌开出未税金额和'] = appliedBrand[key][0];
    newItem['开出未税金额总和'] = totalSum;
    newItem['开出未税金额占比'] = appliedBrand[key][2];
    newItem['应用品牌毛利和'] = appliedBrand[key][1];
    newItem['应用品牌ΣM:毛利/ΣK:开出未税金额'] = appliedBrand[key][3];

    newExcelList[newExcelList.length] = newItem;
  }
  this.postMessage(newExcelList);
}, false);
