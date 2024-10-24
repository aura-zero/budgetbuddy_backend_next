import UserGroups from "@/components/UserGroups";
import CreateGroup from "@/components/CreateGroup";

export default function GroupsPage() {
    return (
        <div className="flex bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45% min-h-screen  items-center  justify-items-center overflow-x-hidden">
            <UserGroups />
            <CreateGroup />
        </div>
    );
}
