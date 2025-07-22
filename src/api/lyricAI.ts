import { getOpenAIChatResponse } from './chat-service';

export interface LyricSuggestion {
  text: string;
  type: 'next_line' | 'rewrite' | 'rhyme' | 'style';
}

export async function getSuggestNextLine(currentSection: string, sectionType: string): Promise<string> {
  const prompt = `You are a creative songwriting assistant. Given this ${sectionType} section:

"${currentSection}"

Suggest ONE natural next line that continues the flow and meaning. Keep it concise and authentic. Return only the line, no explanation.`;

  try {
    const response = await getOpenAIChatResponse(prompt);
    return response.content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return "Let the music guide your words...";
  }
}

export async function rewriteLine(line: string, context: string): Promise<string> {
  const prompt = `Rewrite this lyric line to be more impactful while keeping the same meaning and flow:

Original line: "${line}"
Context: "${context}"

Return only the rewritten line, no explanation.`;

  try {
    const response = await getOpenAIChatResponse(prompt);
    return response.content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return line;
  }
}

export async function findRhyme(lastWord: string, context: string): Promise<string> {
  const prompt = `Suggest a lyric line that ends with a word that rhymes with "${lastWord}". 

Context: "${context}"

Make it meaningful and fit the song's theme. Return only the line, no explanation.`;

  try {
    const response = await getOpenAIChatResponse(prompt);
    return response.content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return `Finding words that rhyme with ${lastWord}...`;
  }
}

export async function styleAsArtist(text: string, artist: string): Promise<string> {
  const prompt = `Rewrite these lyrics in the style of ${artist}, keeping the core meaning but adapting the language, rhythm, and imagery to match their typical songwriting:

"${text}"

Return only the rewritten lyrics, no explanation.`;

  try {
    const response = await getOpenAIChatResponse(prompt);
    return response.content.trim().replace(/^["']|["']$/g, '');
  } catch (error) {
    return text;
  }
}