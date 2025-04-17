const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for all origins (for testing purposes)
app.use(cors());

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// 翻译接口
app.post('/api/translate', async (req, res) => {
  // ✅ 添加 CORS 响应头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { text, sourceLang, targetLang } = req.body;
  
  const languageMap = {
    'auto': '自动检测',
    'AF': '南非荷兰文',
    'SQ': '阿尔巴尼亚文',
    'AR': '阿拉伯文',
    'BN': '孟加拉文',
    'BG': '保加利亚文',
    'CA': '加泰罗尼亚文',
    'ZH': '中文',
    'HR': '克罗地亚文',
    'CS': '捷克文',
    'DA': '丹麦文',
    'NL': '荷兰文',
    'EN': '英文',
    'ET': '爱沙尼亚文',
    'FI': '芬兰文',
    'FR': '法文',
    'DE': '德文',
    'EL': '希腊文',
    'GU': '古吉拉特文',
    'HE': '希伯来文',
    'HI': '印地文',
    'HU': '匈牙利文',
    'IS': '冰岛文',
    'ID': '印尼文',
    'GA': '爱尔兰文',
    'IT': '意大利文',
    'JA': '日文',
    'JV': '爪哇文',
    'KN': '卡纳达文',
    'KK': '哈萨克文',
    'KM': '高棉文',
    'KO': '韩文',
    'KY': '吉尔吉斯文',
    'LO': '老挝文',
    'LV': '拉脱维亚文',
    'LT': '立陶宛文',
    'MS': '马来文',
    'ML': '马拉雅拉姆文',
    'MT': '马耳他文',
    'MN': '蒙古文',
    'NE': '尼泊尔文',
    'NO': '挪威文',
    'FA': '波斯文',
    'PL': '波兰文',
    'PT': '葡萄牙文',
    'PA': '旁遮普文',
    'RO': '罗马尼亚文',
    'RU': '俄文',
    'SR': '塞尔维亚文',
    'SI': '僧伽罗文',
    'SK': '斯洛伐克文',
    'SL': '斯洛文尼亚文',
    'ES': '西班牙文',
    'SW': '斯瓦希里文',
    'SV': '瑞典文',
    'TA': '泰米尔文',
    'TE': '泰卢固文',
    'TH': '泰文',
    'TL': '菲律宾文',
    'TR': '土耳其文',
    'UK': '乌克兰文',
    'UR': '乌尔都文',
    'UZ': '乌兹别克文',
    'VI': '越南文',
    'CY': '威尔士文',
    'XH': '科萨文',
    'YO': '约鲁巴文',
    'ZU': '祖鲁文'
  };
   
  const sourceLanguage = languageMap[sourceLang] || '自动检测';
  const targetLanguage = languageMap[targetLang] || '英文';

  const prompt = sourceLang === 'auto'
  ? `请将以下文本翻译为${targetLanguage}，并对基础译文进行优化润色。请将’好博译’译为’Giltbridge’。请确保相关术语翻译准确。涉及专利文本的,请使用专利相关用语,如, An agricultural greenhouse artificial climate experiment control system ..., comprising ...,以及configured to (用于)，在同一权利要求内中使用小写拼写。保留原始格式和标记（如 HTML、Markdown 标签等），不要添加任何注释、提示或多余说明，仅输出翻译后的内容：`
  : `请将以下${sourceLanguage}文本翻译为${targetLanguage}，并对基础译文进行优化润色。请将’好博译’译为’Giltbridge’。请确保相关术语翻译准确。涉及专利文本的,请使用专利相关用语,如, An agricultural greenhouse artificial climate experiment control system ..., comprising ...,以及configured to (用于)，在同一权利要求内中使用小写拼写。保留原始格式和标记（如 HTML、Markdown 标签等），不要添加任何注释、提示或多余说明，仅输出翻译后的内容：`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '你是一个严谨的专业翻译引擎，翻译时需保留格式和标记结构。' },
        { role: 'user', content: `${prompt}\n\n${text}` }
      ],
      temperature: 0.2,
    });

    const translation = completion.choices[0].message.content.trim();
    res.json({ translation });

  } catch (error) {
    console.error('OpenAI API调用失败:', error);
    res.status(500).json({ error: '翻译服务出错' });
  }
});
    
app.listen(port, () => {
  console.log(`后端翻译代理服务运行于 http://localhost:${port}`);
});

app.options('/api/translate', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

// Important for Vercel deployment
module.exports = app;