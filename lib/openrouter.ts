import { Message } from 'ai'

export type AvailableModel = string

export async function getAvailableModels() {
	try {
		const response = await fetch('/api/models')
		if (!response.ok) {
			throw new Error(`Failed to fetch models: ${response.statusText}`)
		}
		const data = await response.json()
		return data
	} catch (error) {
		console.error('Error fetching models:', error)
		throw error
	}
}

export function buildPrompt(messages: Message[]) {
	const lastMessage = messages[messages.length - 1]
	if (!lastMessage) return ''

	const history = messages.slice(0, -1)
		.map(message => `${message.role}: ${message.content}`)
		.join('\n')

	return history ? `${history}\n\n${lastMessage.content}` : lastMessage.content
}

export async function chat(messages: Message[], modelId: string) {
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

		const response = await fetch('/api/process', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				messages: [
					{ role: "system" as const, content: systemMessage.content },
					...messages.slice(0, -1),
					{ role: 'user', content: prompt }
				],
				model: modelId,
			}),
		})

		if (!response.ok) {
			throw new Error('Failed to process chat')
		}

		return response
	} catch (error) {
		console.error('Error in chat:', error)
		throw error
	}
}
