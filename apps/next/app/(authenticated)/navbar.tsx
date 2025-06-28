import { ThemeSwitcher } from '@/components/theme-switcher';
import { SidebarTrigger } from '@/components/ui/sidebar';

export interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  return (
    <nav className={`w-full bg-sidebar border-b p-2 flex items-center fixed ${className ?? ''}`}>
      <SidebarTrigger className="cursor-pointer" />
      <ThemeSwitcher />
    </nav>
  );
}
