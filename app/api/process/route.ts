import { Message, streamText } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { z } from 'zod'


const requestSchema = z.object({
	messages: z.array(z.object({
		id: z.string().optional(),
		role: z.string(),
		content: z.string(),
	})).optional(),
	metaprompt: z.string(),
	input: z.string(),
	model: z.enum(['claude', 'llama', 'mistral']).default('claude'),
})

export async function POST(req: Request) {
	try {
		const json = await req.json()
		const { messages = [], metaprompt, input, model } = requestSchema.parse(json)

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

		const openrouter = createOpenRouter({
			apiKey: process.env.OPENROUTER_API_KEY,
		})

		const result = await streamText({
			model: openrouter(model),
			messages: updatedMessages.map(msg => ({
				...msg,
				id: msg.id || crypto.randomUUID() // Ensure id is always defined
			})) as Message[]
		})

		return result.toDataStreamResponse()
	} catch (error) {
		console.error('Error processing metaprompt:', error)
		
		// Determine if it's a validation error
		if (error instanceof z.ZodError) {
			return new Response(
				JSON.stringify({
					error: 'Validation error',
					details: error.errors
				}),
				{ 
					status: 400,
					headers: {
						'Content-Type': 'application/json'
					}
				}
			)
		}

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