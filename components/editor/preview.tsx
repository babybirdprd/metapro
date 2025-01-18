'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEditorStore } from '@/lib/store'
import { useChat } from 'ai/react'
import { useCallback, useEffect } from 'react'

export function Preview() {
	const { 
		content, 
		testInput, 
		setTestInput, 
		messages: storeMessages, 
		setMessages: setStoreMessages,
		clearMessages 
	} = useEditorStore()
	const { messages, handleSubmit, isLoading, setMessages } = useChat({
		api: '/api/process',
		body: {
			metaprompt: content,
		},
		onResponse: (response) => {
			if (!response.ok) {
				throw new Error('Failed to generate response')
			}
		},
		onFinish: (message) => {
			setStoreMessages([...storeMessages, message])
		},
		onError: (error) => {
			console.error('Error:', error)
		},
	})

	// Clear messages when content changes
	useEffect(() => {
		setMessages([])
		clearMessages()
	}, [content, setMessages, clearMessages])

	const handleGenerate = useCallback((e: React.FormEvent) => {
		e.preventDefault()
		if (!testInput || !content) return
		handleSubmit(e, { 
			options: { 
				body: { 
					input: testInput,
					messages: storeMessages 
				} 
			} 
		})
	}, [content, testInput, storeMessages, handleSubmit])

	return (
		<Card className="h-full border-0 rounded-none">
			<Tabs defaultValue="input" className="h-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="input">Test Input</TabsTrigger>
					<TabsTrigger value="output">Output</TabsTrigger>
				</TabsList>
				<TabsContent value="input" className="h-[calc(90vh-40px)]">
					<div className="flex flex-col h-full gap-4 p-4">
						<Textarea 
							placeholder="Enter your test input here..."
							className="flex-1 font-mono"
							value={testInput}
							onChange={(e) => setTestInput(e.target.value)}
						/>
						<Button 
							onClick={handleGenerate}
							disabled={isLoading || !content || !testInput}
						>
							{isLoading ? 'Generating...' : 'Generate Output'}
						</Button>
					</div>
				</TabsContent>
				<TabsContent value="output" className="h-[calc(90vh-40px)]">
					<ScrollArea className="h-full p-4">
						<div className="space-y-4">
							{messages.map(m => (
								<div key={m.id} className="whitespace-pre-wrap">
									<pre className="text-sm font-mono bg-muted p-4 rounded-lg">
										{m.content}
									</pre>
								</div>
							))}
							{messages.length === 0 && (
								<div className="text-muted-foreground text-sm">
									Output will appear here...
								</div>
							)}
						</div>
					</ScrollArea>
				</TabsContent>
			</Tabs>
		</Card>
	)
}
