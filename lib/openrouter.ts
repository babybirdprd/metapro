import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { Message } from 'ai'

const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
})

// Default to Claude 3 Sonnet for high quality responses
const defaultModel = 'anthropic/claude-3-sonnet'

export function buildPrompt(messages: Message[]) {
	// Extract the metaprompt from the last message
	const lastMessage = messages[messages.length - 1]
	if (!lastMessage) return ''

	// Build conversation history excluding the last message (metaprompt)
	const history = messages.slice(0, -1)
		.map(message => `${message.role}: ${message.content}`)
		.join('\n')

	return history ? `${history}\n\n${lastMessage.content}` : lastMessage.content
}

export async function chat(messages: Message[], model = defaultModel) {
	const prompt = buildPrompt(messages)
	
	// Create a system message that explains how to handle metaprompts
	const systemMessage = {
		role: 'system',
		content: `You are an expert prompt engineer processing metaprompts. 
		The input will be an XML-formatted metaprompt with user input.
		Process the metaprompt according to its structure and generate appropriate output.
		Maintain a professional and precise tone in your responses.`
	}

	const stream = await openrouter.chatModel(model).stream([
		systemMessage,
		...messages.slice(0, -1), // Previous conversation
		{ role: 'user', content: prompt } // Processed metaprompt
	])

	return stream
}

export const getAvailableModels = async () => {
	const response = await fetch('https://openrouter.ai/api/v1/models', {
		headers: {
			'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
			'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
			'X-Title': 'Metaprompting Studio',
		},
	})
	return response.json()
}