import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input } = req.body;

  if (!input) {
    return res.status(400).json({ error: '위치 정보를 입력해주세요.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY 환경변수가 설정되지 않았습니다.' });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // 편의점 안내에 특화된 프롬프트 설정
    const prompt = `사용자가 다음 위치나 상황을 입력했습니다: "${input}". 
이 사용자를 위해 주변에 있을 법한 편의점 유형, 추천하는 방문 동선, 혹은 해당 지역의 편의점 이용 팁을 친절하고 상세하게 안내해 주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini 3.1 flash lite',
      contents: prompt,
    });

    return res.status(200).json({ result: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return res.status(500).json({ error: 'AI 응답 생성 중 오류가 발생했습니다.' });
  }
}
