import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Twitter } from 'lucide-react';

const footerLinks = {
  "For Candidates": [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/signup", label: "Create Profile" },
    { href: "/student/dashboard", label: "My Dashboard" },
  ],
  "For Companies": [
    { href: "/signup", label: "Post a Job" },
    { href: "/companies", label: "Browse Companies" },
    { href: "/company/dashboard", label: "Company Dashboard" },
  ],
  "Company": [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/admin/dashboard", label: "Admin Login" },
  ],
};

const socialLinks = [
  { name: 'Twitter', href: "#", icon: Twitter },
  { name: 'Github', href: "#", icon: Github },
  { name: 'Linkedin', href: "#", icon: Linkedin },
];

export function SiteFooter() {
  return (
    <footer className="bg-card border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Logo />
            <p className="text-muted-foreground text-sm max-w-sm">
              TAG Connect is your trusted partner in connecting talent with opportunity. We provide a seamless marketplace for students, skilled workers, and companies.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold text-foreground mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TAG MEDIA. All rights reserved.
          </p>
          <div className="flex gap-2">
            {socialLinks.map((link) => (
              <Button key={link.name} variant="ghost" size="icon" asChild>
                <Link href={link.href}>
                  <link.icon className="h-4 w-4" />
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
