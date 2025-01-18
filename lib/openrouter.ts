import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { Message, streamText } from 'ai'

export type AvailableModel = string

const openrouter = createOpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
})

export function buildPrompt(messages: Message[]) {
	const lastMessage = messages[messages.length - 1]
	if (!lastMessage) return ''

	const history = messages.slice(0, -1)
		.map(message => `${message.role}: ${message.content}`)
		.join('\n')

	return history ? `${history}\n\n${lastMessage.content}` : lastMessage.content
}

export async function chat(messages: Message[], modelId: string) {
	if (!process.env.OPENROUTER_API_KEY) {
		throw new Error('OPENROUTER_API_KEY is not set')
	}

	try {
		const prompt = buildPrompt(messages)
		
		const systemMessage = {
			role: 'system',
			content: `You are an expert prompt engineer processing metaprompts. 
			The input will be an XML-formatted metaprompt with user input.
			Process the metaprompt according to its structure and generate appropriate output.
			Maintain a professional and precise tone in your responses.
			Focus on providing clear, actionable output based on the metaprompt structure.`
		}

		const result = streamText({
			model: openrouter(modelId),
			messages: [
				{ role: "system" as const, content: systemMessage.content },
				...messages.slice(0, -1),
				{ role: 'user', content: prompt }
			]
		})

		return result.toDataStreamResponse()

		return Response
	} catch (error) {
		console.error('Error in chat:', error)
		throw error

	}
}

export async function getAvailableModels() {
	if (!process.env.OPENROUTER_API_KEY) {
		throw new Error('OPENROUTER_API_KEY is not set')
	}

	try {
		const response = await fetch('https://openrouter.ai/api/v1/models', {
			headers: {
				'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
				'HTTP-Referer': process.env.VERCEL_URL || 'http://localhost:3000',
				'X-Title': 'Metaprompting Studio',
			},
		})
		
		if (!response.ok) {
			throw new Error('Failed to fetch models')
		}
		
		return response.json()
	} catch (error) {
		console.error('Error fetching models:', error)
		throw error
	}
}