'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useEditorStore } from '@/lib/store'
import { useChat } from 'ai/react'
import { useCallback, useEffect, useState } from 'react'
import { AvailableModel, getAvailableModels } from '@/lib/openrouter'
import { toast } from 'sonner'

export function Preview() {
	const [selectedModel, setSelectedModel] = useState<AvailableModel>('')
	const [models, setModels] = useState<{id: string, name: string}[]>([])

	useEffect(() => {
		const fetchModels = async () => {
			try {
				const response = await getAvailableModels()
				if (response.data) {
					const modelList = response.data.map((model: any) => ({
						id: model.id,
						name: model.name
					}))
					setModels(modelList)
					if (modelList.length > 0) {
						setSelectedModel(modelList[0].id)
					}
				}
			} catch (error) {
				console.error('Error fetching models:', error)
				toast.error('Failed to fetch available models')
			}
		}
		fetchModels()
	}, [])
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
			model: selectedModel,
		},
		onResponse: (response) => {
			if (!response.ok) {
				toast.error('Failed to generate response')
				throw new Error('Failed to generate response')
			}
		},
		onFinish: (message) => {
			setStoreMessages([...storeMessages, message])
		},
		onError: (error) => {
			console.error('Error:', error)
			toast.error('Error generating response')
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
			body: { 
				input: testInput,
				messages: storeMessages,
				model: selectedModel,
			}
		})

	}, [content, testInput, storeMessages, selectedModel, handleSubmit])

	return (
		<Card className="h-full border-0 rounded-none">
			<Tabs defaultValue="input" className="h-full">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="input">Test Input</TabsTrigger>
					<TabsTrigger value="output">Output</TabsTrigger>
				</TabsList>
				<TabsContent value="input" className="h-[calc(90vh-40px)]">
          <div className="flex flex-col h-full gap-4 p-4">
            <div className="flex gap-4 items-center">
              <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value as AvailableModel)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
  {models.map((model) => (
	<SelectItem key={model.id} value={model.id}>
	  {model.name}
	</SelectItem>
  ))}
                </SelectContent>
              </Select>
            </div>
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
