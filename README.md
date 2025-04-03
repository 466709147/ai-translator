# Giltbridge AI Translation Backend

This is a Node.js + Express backend for the Giltbridge AI translation tool. It provides an API endpoint to translate text using OpenAI's GPT model.

## 🚀 API Endpoint

```
POST /api/translate
```

## 🔧 Request Body

```json
{
  "text": "Your source text",
  "sourceLang": "EN",
  "targetLang": "ZH"
}
```

## 📦 Setup Instructions

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your OpenAI API key:

```
OPENAI_API_KEY=your-openai-api-key
```

4. Start the server:

```bash
npm start
```

By default, the server will run on `http://localhost:3000` (or a `PORT` defined in environment variables).

## 🌐 CORS Support

CORS is enabled for all origins by default for development/testing purposes.

## 📡 Deployment on Render

- Make sure `PORT` is read from `process.env.PORT || 3000`
- Add environment variable in Render dashboard:

```
OPENAI_API_KEY=your-openai-api-key
```

- Render will auto-detect the start command from `package.json`.

