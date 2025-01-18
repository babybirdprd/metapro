import { NextResponse } from 'next/server'

export async function GET() {
	const apiKey = process.env.OPENROUTER_API_KEY
	console.log('API Key available:', !!apiKey)

	if (!apiKey) {
		console.error('OPENROUTER_API_KEY is not set')
		return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
	}

	try {
		const response = await fetch('https://openrouter.ai/api/v1/models', {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
				'X-Title': 'Metaprompting Studio',
				'Content-Type': 'application/json',
			},
			next: { revalidate: 3600 }
		})
		
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}))
			console.error('OpenRouter API error:', errorData)
			return NextResponse.json(
				{ error: `Failed to fetch models: ${response.statusText}. ${JSON.stringify(errorData)}` },
				{ status: response.status }
			)
		}
		
		const data = await response.json()
		if (!data.data || !Array.isArray(data.data)) {
			return NextResponse.json(
				{ error: 'Invalid response format from OpenRouter API' },
				{ status: 500 }
			)
		}
		
		return NextResponse.json({ data: data.data })
	} catch (error) {
		console.error('Error fetching models:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch models' },
			{ status: 500 }
		)
	}
}