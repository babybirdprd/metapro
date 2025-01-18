'use client'

import Editor from '@monaco-editor/react'
import { Card } from '@/components/ui/card'
import { useEditorStore } from '@/lib/store'

export function MetapromptEditor() {
	const { content, setContent } = useEditorStore()

	const defaultValue = `<purpose>
	You are an expert prompt engineer.
	Your task is to generate a comprehensive prompt.
</purpose>

<instructions>
	<instruction>Analyze the input carefully.</instruction>
	<instruction>Create a detailed prompt.</instruction>
</instructions>

<user-input>
	{{user-input}}
</user-input>`

	return (
		<Card className="h-full border-0 rounded-none">
			<Editor
				height="90vh"
				defaultLanguage="xml"
				value={content || defaultValue}
				onChange={(value) => setContent(value || '')}
				theme="vs-dark"
				options={{
					minimap: { enabled: true },
					fontSize: 14,
					lineNumbers: 'on',
					wordWrap: 'on',
					formatOnPaste: true,
					formatOnType: true,
				}}
			/>
		</Card>
	)
}