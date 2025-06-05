import { AdminSearch } from "../admin/search";
import { ModernLogo } from "../ui/modern-logo";
import { ThemeToggle } from "../ui/theme-toggle";

export const AdminHeader = async () => {
	return (
		<header className="flex h-[60px] items-center gap-4 px-6 bg-background border-b border-border text-foreground">
			<div className="flex items-center justify-between w-full">
				<div className="flex items-center gap-4">
					<AdminSearch />
				</div>
				<div className="flex items-center gap-4">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
};