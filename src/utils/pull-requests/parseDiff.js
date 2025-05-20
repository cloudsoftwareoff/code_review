export const parseDiff = (diff) => {
  if (!diff) return { left: [], right: [], headers: [] };

  const lines = diff.split('\n');
  const result = { left: [], right: [], headers: [] };
  let leftLineNum = 0;
  let rightLineNum = 0;
  let currentHunk = null;

  for (const line of lines) {
    if (line.startsWith('@@')) {
      currentHunk = line;
      result.headers.push(line);
      const match = line.match(/@@ -(\d+),?\d* \+(\d+),?\d* @@/);
      if (match) {
        leftLineNum = parseInt(match[1], 10);
        rightLineNum = parseInt(match[2], 10);
      }
      continue;
    }

    if (line.startsWith('+')) {
      result.right.push({
        content: line.slice(1),
        lineNum: rightLineNum,
        type: 'added',
      });
      result.left.push({ content: '', lineNum: null, type: 'empty' });
      rightLineNum++;
    } else if (line.startsWith('-')) {
      result.left.push({
        content: line.slice(1),
        lineNum: leftLineNum,
        type: 'removed',
      });
      result.right.push({ content: '', lineNum: null, type: 'empty' });
      leftLineNum++;
    } else {
      const content = line.startsWith(' ') ? line.slice(1) : line;
      result.left.push({
        content,
        lineNum: leftLineNum,
        type: 'unchanged',
      });
      result.right.push({
        content,
        lineNum: rightLineNum,
        type: 'unchanged',
      });
      leftLineNum++;
      rightLineNum++;
    }
  }

  return result;
};