//
// TSVテキストをJSON化する
//
export default function tsv2json(text: string, space: string|number) {
  // 改行とTABで行列分割
  // 参考：https://github.com/jonmagic/copy-excel-paste-markdown/blob/master/script.js
  const rows = text
    .trim()
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split(/[\u0085\u2028\u2029]|\n/g)
    .map((row) => {
      row = row.replace("\n", " ");
      return row.split("\t");
    });

  // 空
  if (!rows.length) return "";

  // 1行
  if (rows.length === 1) {
    // 空
    if (!rows[0].length) return "";

    // 1列
    if (rows[0].length === 1) return JSON.stringify(rows[0][0], null, space);

    // 2列
    // ----------
    // | Ａ | B |
    // ----------
    if (rows[0].length === 2) {
      // 配列にするか？連想配列にするか？ユーザーが選択できるといいけど、とりあえず連想配列に変換
      const array = {
        [rows[0][0]]: rows[0][1],
      };
      return JSON.stringify(array, null, space);
    }

    // 3列以上
    // -----------------
    // | Ａ | B | C | ..
    // -----------------
    // ・全体を配列にするか？連想配列にするか？ユーザーが選択できるといいけど、とりあえず連想配列に変換
    const array = {
      [rows[0][0]]: rows[0].slice(1),
    };
    return JSON.stringify(array, null, space);
  }

  // 2行以上
  // ------------------------
  // | ID  | 名前　 | 値段 | ..
  // ------------------------
  // | 001 | いちご | 100 | ..
  // | 002 | みかん | 200 | ..
  // ------------------------
  // ・1行目をヘッダ、2行目以降を値、と決め打ちして連想配列に変換
  //   [
  //     {
  //       "ID": "001",
  //       "名前": "いちご",
  //       "値段": "100",
  //     },
  //     {
  //       "ID": "001",
  //       "名前": "みかん",
  //       "値段": "200",
  //     }
  //   ]
  // ・ヘッダの文字列が空だったら、その列は無視する
  // ・同名ヘッダがあった場合は上書きされて1列だけ残る
  let array = [];
  let keys: string[] = [];
  let indexes: number[] = [];

  for (let i = 0; i < rows[0].length; ++i) {
    if (!rows[0][i].length) continue;
    keys.push(rows[0][i]);
    indexes.push(i);
  }

  for (let i = 1; i < rows.length; ++i) {
    array.push(row2array(rows[i]));
  }

  function row2array(row: string[]) {
    let array: { [key: string]: string } = {};
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const index = indexes[i];
      array[key] = row[index];
    }
    return array;
  }

  return JSON.stringify(array, null, space);
}
