import { cn } from "@/lib/utils";
import Link from "next/link";

interface Props {
    itemName: string,
    itemIcon: React.ReactNode,
    itemActive?: boolean,
    itemHref: string,
    handleClick: () => void
}

const SidebarItem = ({
    itemName,
    itemIcon,
    itemActive,
    itemHref,
    handleClick
}: Props) => {


    return (
        <>
            <Link href={itemHref} className={cn(
                "flex py-2 px-2 rounded-sm justify-between hover:bg-muted-foreground/10 hover:text-white",
                itemActive && "border-r-4 bg-muted-foreground/10 border-sky-400 dark:text-white font-bold"
            )}
                onClick={handleClick}
            >

                <div className="flex items-center w-full">
                    {itemIcon}
                    <div className="flex flex-col w-full">

                        <p className="ms-2 flex items-center justify-between">
                            {itemName}
                        </p>
                    </div>
                </div>

            </Link>
        </>
    )
}

export default SidebarItem;