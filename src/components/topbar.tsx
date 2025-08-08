import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";

type TopbarProps = {
    projectTitle: string;
};

export function Topbar({ projectTitle }: TopbarProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <h1 className="font-headline text-2xl font-bold tracking-tighter text-foreground">
                {projectTitle}
            </h1>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[320px] h-9"
                />
            </div>
            <Avatar>
                <AvatarImage src="https://placehold.co/100x100.png" alt="User" data-ai-hint="person avatar"/>
                <AvatarFallback>U</AvatarFallback>
            </Avatar>
        </header>
    );
}
