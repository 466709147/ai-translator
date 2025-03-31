const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

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
    'EN': '英文',
    'ZH': '中文',
    'JA': '日文',
    'FR': '法文',
    'DE': '德文',
    'ES': '西班牙文',
    'RU': '俄文',
    'KO': '韩文',
    'IT': '意大利文',
    'PT': '葡萄牙文',
    'NL': '荷兰文',
    'SV': '瑞典文',
    'DA': '丹麦文',
    'FI': '芬兰文',
    'NO': '挪威文',
    'PL': '波兰文',
    'CS': '捷克文',
    'TR': '土耳其文',
    'AR': '阿拉伯文',
    'HI': '印地文',
    'BN': '孟加拉文',
    'VI': '越南文',
    'TH': '泰文',
    'MS': '马来文',
    'ID': '印尼文',
    'HE': '希伯来文',
    'EL': '希腊文',
    'HU': '匈牙利文',
    'RO': '罗马尼亚文',
    'UK': '乌克兰文',
    'BG': '保加利亚文',
    'HR': '克罗地亚文',
    'SK': '斯洛伐克文',
    'LT': '立陶宛文',
    'LV': '拉脱维亚文',
    'SL': '斯洛文尼亚文',
    'SR': '塞尔维亚文',
    'FA': '波斯文',
    'UR': '乌尔都文',
    'TL': '菲律宾文',
    'AF': '南非荷兰文',
    'IS': '冰岛文',
    'ET': '爱沙尼亚文',
    'CA': '加泰罗尼亚文',
    'MT': '马耳他文',
    'GA': '爱尔兰文',
    'SW': '斯瓦希里文',
    'CY': '威尔士文',
    'SQ': '阿尔巴尼亚文'
  };
  
  const sourceLanguage = languageMap[sourceLang] || '自动检测';
  const targetLanguage = languageMap[targetLang] || '英文';

  const prompt = sourceLang === 'auto' 
    ? `请将以下文本翻译为${targetLanguage}：`
    : `请将以下${sourceLanguage}文本翻译为${targetLanguage}：`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: '你是一个专业翻译引擎。' },
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