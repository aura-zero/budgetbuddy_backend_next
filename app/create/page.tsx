import CreateComponent from "@/components/Create";

export default function SomePage() {
    return (
        <div className="flex w-full h-full bg-[#07011F]  ">
            <div className="mx-auto">
                <h1 className="text-3xl">Manage Your Budget</h1>
                <CreateComponent />
                {/* Other components */}
            </div>
        </div>
    );
}
