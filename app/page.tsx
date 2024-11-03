import UserInfo from "@/components/UserInfo";
import CreateGroup from "@/components/CreateGroup";
import UserGroups from "@/components/UserGroups";
export default function Home() {
    return (
        <div className="flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45% h-screen w-screen  items-center  justify-items-center overflow-x-hidden">
            <UserInfo />
            <div></div>
        </div>
    );
}
