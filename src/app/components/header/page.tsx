import Image from "next/image";

export default function Header() {
    return(
        <header className="bg-[#1e73be] p-2 fixed w-full">
            <Image src="/logo.png" width={100} height={100} alt="" className="w-32"/>
        </header>
    )
}