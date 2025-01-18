import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const templates = [
	{
		id: 'code-review',
		title: 'Code Review',
		description: 'Analyze code and report bugs with severity rankings',
		example: 'Purpose: Analyze code and report bugs...'
	},
	{
		id: 'blog-post',
		title: 'Blog Post Generator',
		description: 'Convert scripts into engaging blog posts',
		example: 'Purpose: Create a html + css only blog post...'
	}
]

export default function TemplatesPage() {
	return (
		<div className="container py-8">
			<h1 className="text-3xl font-bold mb-8">Metaprompt Templates</h1>
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{templates.map((template) => (
					<Card key={template.id}>
						<CardHeader>
							<CardTitle>{template.title}</CardTitle>
							<CardDescription>{template.description}</CardDescription>
						</CardHeader>
						<CardContent>
							<pre className="bg-muted p-4 rounded-md text-sm mb-4 overflow-hidden text-ellipsis">
								{template.example}
							</pre>
							<Link href={`/studio?template=${template.id}`}>
								<Button className="w-full">Use Template</Button>
							</Link>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	)
}