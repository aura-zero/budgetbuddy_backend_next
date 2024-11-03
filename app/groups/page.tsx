import UserGroups from "@/components/UserGroups";
import CreateGroup from "@/components/CreateGroup";
import GroupTransactionsViewer from "@/components/GroupManagement";
export default function GroupsPage() {
    return (
        <div className="flex  h-screen w-screen justify-between  bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1b143a] from-0% to-[#07011F] to-45% overflow-x-hidden">
            <GroupTransactionsViewer />
            {/* <UserGroups /> */}
            {/* <CreateGroup /> */}
        </div>
    );
}
