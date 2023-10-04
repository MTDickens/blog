下面的脚本，可以在[浙江大学教务网](http://jwbinfosys.zju.edu.cn)的[成绩查询页面](http://jwbinfosys.zju.edu.cn/xscj.aspx)一键获取 5 分制、4.3 分制、4 分制和百分制的 GPA。

使用方法：

1. 在浏览器中按下快捷键 ctrl+shift+J，打开 Javascript 调试界面
2. 将代码粘贴到 console 中去，回车
3. 然后 console 下面的输出就是平均绩点

```js
// 获取表格
let table = document.getElementById("DataGrid1");

// 获取表格中的所有行
let rows = table.getElementsByTagName("tr");

// 初始化变量
let totalCredits = 0;
let totalGPA5 = 0;
let totalGPA100 = 0;
let totalGPA4_3 = 0;
let totalGPA4 = 0;

let scoreList = [95, 92, 89, 86, 83, 80, 77, 74, 71, 68, 65, 62, 60, 0]
let gpa4_3List = [4.3, 4.2, 4.1, 4.0, 3.9, 3.6, 3.3, 3, 2.7, 2.4, 2.1, 1.8, 1.5, 0]
convertScoreToGPA4_3 = (score) => {
  let index = scoreList.findIndex((val) => val <= score);
  if (index !== -1) {
    return gpa4_3List[index];
  } else {
    // Handle scores that are greater than the maximum score in the list
    return null; // or any other appropriate score
  }
}

// 循环遍历每一行（跳过表头）
for (let i = 1; i < rows.length; i++) {
  // 获取每一行中的所有单元格
  let cells = rows[i].getElementsByTagName("td");

  // 获取该课程的学分和绩点
  let credits = parseFloat(cells[3].innerText);
  let gpa = parseFloat(cells[4].innerText);
  let score = parseFloat(cells[2].innerText);

  // 计算该课程的总绩点
  let courseGPA5 = credits * gpa;
  let courseGPA100 = credits * score;
  let courseGPA4_3 = credits * convertScoreToGPA4_3(score);
  let courseGPA4 = credits * ((score >= 85) ? 4 : (score >= 60 ? ((score - 60) / 10 + 1.5) : 0))

  // 累加总学分和总绩点
  totalCredits += credits;
  totalGPA5 += courseGPA5;
  totalGPA100 += courseGPA100;
  totalGPA4_3 += courseGPA4_3;
  totalGPA4 += courseGPA4;
}

// 计算GPA
let gpa5 = totalGPA5 / totalCredits;
let gpa100 = totalGPA100 / totalCredits;
let gpa4_3 = totalGPA4_3 / totalCredits;
let gpa4 = totalGPA4 / totalCredits;

// 输出结果
console.log(`GPA5: ${gpa5}\nGPA100: ${gpa100}\nGPA4.3: ${gpa4_3}\nGPA4: ${gpa4}`);
```