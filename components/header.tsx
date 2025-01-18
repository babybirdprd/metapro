import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function Header() {
	return (
		<header className="border-b">
			<div className="flex h-16 items-center px-4 gap-4">
				<Link href="/" className="font-bold">
					Metaprompting Studio
				</Link>
				<nav className="flex-1 ml-4">
					<ul className="flex gap-4">
						<li>
							<Link href="/studio">
								<Button variant="ghost">Studio</Button>
							</Link>
						</li>
						<li>
							<Link href="/templates">
								<Button variant="ghost">Templates</Button>
							</Link>
						</li>
					</ul>
				</nav>
				<ModeToggle />
			</div>
		</header>
	)
}