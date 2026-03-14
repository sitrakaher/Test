"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Campagnes' },
        { href: '/campaigns/create', label: 'Créer' },
        { href: '/campaigns/DashboardStats', label: 'Dashboard' },
    ];

    return (
        <nav className="w-full bg-white dark:bg-black border-b border-gray-200 px-8 py-4">
            <div className="flex gap-6 items-center">
                <span className="font-bold text-xl mr-8">AdTech</span>
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`px-4 py-2 rounded transition-colors ${
                            pathname === link.href
                                ? 'bg-cyan-400 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

export default Navbar;