import { NextResponse } from 'next/server'

export async function GET() {
	const apiKey = process.env.OPENROUTER_API_KEY
	console.log('API Key available:', !!apiKey) // Debug log

	if (!apiKey) {
		console.error('OPENROUTER_API_KEY is not set')
		return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
	}

	try {
		const response = await fetch('https://openrouter.ai/api/v1/models', {
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'HTTP-Referer': 'http://localhost:3000',
				'X-Title': 'Metaprompting Studio',
				'Content-Type': 'application/json',
			},
			cache: 'no-store'
		})
		
		if (!response.ok) {
			const errorText = await response.text()
			console.error('OpenRouter API error:', errorText)
			throw new Error(`Failed to fetch models: ${response.statusText}`)
		}
		
		const data = await response.json()
		return NextResponse.json({ data: data.data || [] })
	} catch (error) {
		console.error('Error fetching models:', error)
		return NextResponse.json(
			{ error: error instanceof Error ? error.message : 'Failed to fetch models' }, 
			{ status: 500 }
		)
	}
}