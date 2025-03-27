function shuffleArray(array: any[]) {
  // 创建副本避免修改原数组
  const shuffled = [...array];

  // 从后往前遍历
  for (let i = shuffled.length - 1; i > 0; i--) {
    // 生成0到i(包含i)的随机索引
    const j = Math.floor(Math.random() * (i + 1));

    // ES6解构赋值交换元素
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export { shuffleArray };
