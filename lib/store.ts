import { create } from 'zustand'
import { Message } from 'ai'

interface EditorState {
	content: string
	testInput: string
	output: string
	isLoading: boolean
	messages: Message[]
	setContent: (content: string) => void
	setTestInput: (input: string) => void
	setOutput: (output: string) => void
	setLoading: (loading: boolean) => void
	setMessages: (messages: Message[]) => void
	addMessage: (message: Message) => void
	clearMessages: () => void
}

export const useEditorStore = create<EditorState>((set) => ({
	content: '',
	testInput: '',
	output: '',
	isLoading: false,
	messages: [],
	setContent: (content) => set({ content }),
	setTestInput: (input) => set({ testInput: input }),
	setOutput: (output) => set({ output }),
	setLoading: (loading) => set({ isLoading: loading }),
	setMessages: (messages) => set({ messages }),
	addMessage: (message) => set((state) => ({ 
		messages: [...state.messages, message] 
	})),
	clearMessages: () => set({ messages: [] }),
}))