interface MessageContent {
  type: string;
  text?: string;
  image_url?: {
    url: string;
  };
}

interface Message {
  role: string;
  content: MessageContent[];
}

interface TuziRequestBody {
  model: string;
  stream: boolean;
  messages: Message[];
}

interface TuziResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
      text_tokens: number;
    };
    completion_tokens_details?: {
      content_tokens: number;
    };
  };
}

/**
 * 调用兔子AI的聊天完成API
 * @param apiKey API密钥
 * @param model 模型名称
 * @param messages 消息数组
 * @param stream 是否流式输出
 * @returns 返回API响应
 */
export async function tuziChatCompletion(
  model: string,
  messages: Message[],
  stream: boolean = false
): Promise<string[]> {
  const url = 'https://api.tu-zi.com/v1/chat/completions';
  
  const requestBody: TuziRequestBody = {
    model,
    stream,
    messages
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TUZI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
    if (!response.ok) {
      throw new Error(`API invoke error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json() as TuziResponse
    return extractImageUrlsFromTuziResponse(data);

  } catch (error) {
    console.error('API invoke error:', error);
    throw error;
  }
}

/**
 * 从兔子AI的响应中提取所有图片URL
 * @param response 兔子AI的响应
 * @returns 提取到的图片URL数组
 */
function extractImageUrlsFromTuziResponse(response: TuziResponse): string[] {
  const imageUrls: string[] = [];
  
  // 检查响应中是否有choices
  if (!response.choices || response.choices.length === 0) {
    return imageUrls;
  }
  
  // 遍历所有choices
  for (const choice of response.choices) {
    if (choice.message && choice.message.content) {
      // 使用正则表达式提取URL
      // 匹配以http或https开头的URL
      const urlRegex = /(https?:\/\/[^\s"'<>()]+)/g;
      const content = choice.message.content;
      
      // 查找所有匹配项
      const matches = content.match(urlRegex);
      
      if (matches) {
        // 过滤出图片URL（通常以.png, .jpg, .jpeg, .gif, .webp等结尾）
        const imageUrlMatches = matches.filter(url => {
          // 检查是否为图片URL
          const isImageUrl = /\.(png|jpg|jpeg|gif|webp)($|\?)/i.test(url) || 
                            url.includes('/cdn/') || 
                            url.includes('/assets/');
          return isImageUrl;
        });
        
        imageUrls.push(...imageUrlMatches);
      }
    }
  }
  
  return imageUrls;
}