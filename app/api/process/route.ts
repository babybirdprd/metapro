import { StreamingTextResponse, Message } from 'ai'
import { chat } from '@/lib/openrouter'
import { z } from 'zod'

const requestSchema = z.object({
	messages: z.array(z.object({
		id: z.string().optional(),
		role: z.string(),
		content: z.string(),
	})).optional(),
	metaprompt: z.string(),
	input: z.string(),
})

export async function POST(req: Request) {
	try {
		const json = await req.json()
		const { messages = [], metaprompt, input } = requestSchema.parse(json)

		// Process the metaprompt with user input
		const processedMetaprompt = metaprompt.replace('{{user-input}}', input)
		
		// Filter out any system messages from the history
		const userMessages = messages.filter(m => m.role !== 'system')
		
		// Create the message array with the processed metaprompt
		const updatedMessages = [
			...userMessages,
			{ 
				role: 'user', 
				content: processedMetaprompt,
				id: crypto.randomUUID()
			}
		]

		const stream = await chat(updatedMessages)
		return new StreamingTextResponse(stream)
	} catch (error) {
		console.error('Error processing metaprompt:', error)
		return new Response(
			JSON.stringify({ 
				error: 'Error processing metaprompt',
				details: error instanceof Error ? error.message : 'Unknown error'
			}),
			{ 
				status: 500,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
	}
}