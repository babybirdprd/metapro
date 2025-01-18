import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { MetapromptEditor } from "@/components/editor/metaprompt-editor"
import { Preview } from "@/components/editor/preview"

export default function StudioPage() {
	return (
		<div className="h-screen p-4">
			<ResizablePanelGroup direction="horizontal">
				<ResizablePanel defaultSize={50}>
					<MetapromptEditor />
				</ResizablePanel>
				<ResizableHandle />
				<ResizablePanel defaultSize={50}>
					<Preview />
				</ResizablePanel>
			</ResizablePanelGroup>
		</div>
	)
}