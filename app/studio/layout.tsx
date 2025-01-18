import { Header } from "@/components/header"

export default function StudioLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex-1">
				{children}
			</main>
		</div>
	)
}