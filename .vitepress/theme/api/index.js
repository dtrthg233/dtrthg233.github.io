/* 获取一言 - 改为MFY台词 */
export const getHitokoto = async () => {
    const mfyQuotes = [
        "……好开心啊，凤同学。",
        "其实，我一直都很痛苦。",
        "......我暂时还不会抛开一切哦。",
        "......这样就好了吗？",
        "............我会放弃音乐的。",
        "(......我的合成器......)",
        "我不太清楚......",
        "……没什么。我只是觉得，能被期待是件幸福的事。",
        "妈妈，对不起。……我会放弃音乐的。",
        "我已经……什么都感觉不到了。",
        "……只要消失就好了。",
        "味道……？……抱歉，我尝不出来。",
        "……救救我。",
        "只要在这里，就不会有人期待我了。",
        "……‘我’，到底在哪里？",
        "……原来，哭是这种感觉吗？",
        "……‘开心’是什么样的感觉？",
        "……‘喜欢’，又是什么样的感觉？",
        "只要照着妈妈说的去做，就不会错了。",
        "……对不起，我……不知道该怎么笑。",
        "……心，好像空了一块。",
        "……这就是，‘温暖’吗？",
        "……为什么，大家要对我这么好？",
        "……对不起，给大家添麻烦了。",
        "……已经够了，请不要再管我了。",
        "……你们根本不了解我。",
        "滚出去！",
        "我只想一个人消失！别再纠缠我了！",
        "……这种东西，我不需要！",
        "……对不起，妈妈。我会成为一个好孩子的。",
        "……只要能让妈妈开心，我怎么样都无所谓。",
        "……为什么，眼泪会自己流下来？",
        "……这里是唯一能让我感到安心的地方。",
        "……和大家在一起作曲的时候，稍微……感觉到了什么。",
        "……‘活着’，到底是为了什么？",
        "……我不想……再让任何人失望了。",
        "……好想……消失掉。",
        "……对不起，我果然还是……做不到。",
        "……这就是……‘绝望’吗？",
        "……已经，什么都不想思考了。",
        "……就这样……一直沉睡下去，就好了。",
        "……为什么……胸口会这么痛？",
        "……大家的声音……听起来好遥远。",
        "……我，真的可以……留在这里吗？",
        "……谢谢你，奏。",
        "……这就是，我的‘世界’……",
        "……没有味道的饭菜，我已经习惯了。",
        "……我，真的能被拯救吗？",
        "……‘未来’……我看不到。",
        "……请不要对我抱有期待。",
        // 添加更多MFY台词...
    ];
    
    const randomIndex = Math.floor(Math.random() * mfyQuotes.length);
    return {
        hitokoto: mfyQuotes[randomIndex],
        // from: "MFY"  // 来源显示为MFY
    };
};
/**
 * 获取给定网址的站点图标和描述
 * @param {string} url - 站点 URL
 * @returns {Promise<{iconUrl: string, description: string}>}
 */
export const getSiteInfo = async (url) => {
  const details = {
    iconUrl: null,
    title: null,
    description: null,
  };
  try {
    // 站点数据
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");
    // 获取页面标题
    const titleElement = doc.querySelector("title");
    details.title = titleElement ? titleElement.textContent : "暂无标题";
    // 获取 icon
    let iconLink =
      doc.querySelector("link[rel='shortcut icon']") || doc.querySelector("link[rel='icon']");
    if (iconLink) {
      details.iconUrl = new URL(iconLink.getAttribute("href"), url).href;
    } else {
      details.iconUrl = new URL("/favicon.ico", url).href;
    }
    // 获取描述
    const metaDescription = doc.querySelector("meta[name='description']");
    details.description = metaDescription ? metaDescription.content : "暂无站点描述";
  } catch (error) {
    console.error("获取站点信息失败：", error);
  }
  return details;
};

/**
 * Meting
 * @param {id} string - 歌曲ID
 * @param {server} string - 服务器
 * @param {type} string - 类型
 * @returns {Promise<Object>} - 音乐详情
 */
export const getMusicList = async (url, id, server = "netease", type = "playlist") => {
  const result = await fetch(`${url}?server=${server}&type=${type}&id=${id}`);
  const list = await result.json();
  return list.map((song) => {
    const { pic, ...data } = song;
    return {
      ...data,
      cover: pic,
    };
  });
};

/**
 * 站点统计数据
 */
export const getStatistics = async (key) => {
  const result = await fetch(`https://v6-widget.51.la/v6/${key}/quote.js`);
  const title = [
    "最近活跃",
    "今日人数",
    "今日访问",
    "昨日人数",
    "昨日访问",
    "本月访问",
    "总访问量",
  ];
  const data = await result.text();
  let num = data.match(/(<\/span><span>).*?(\/span><\/p>)/g);
  num = num.map((el) => {
    const val = el.replace(/(<\/span><span>)/g, "");
    return val.replace(/(<\/span><\/p>)/g, "");
  });
  const statistics = {};
  for (let i = 0; i < num.length; i++) {
    if (i === num.length - 1) continue;
    statistics[title[i]] = num[i];
  }
  return statistics;
};
