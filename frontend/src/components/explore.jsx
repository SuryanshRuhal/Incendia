import Feed from "./Feed";


const Explore = () => {
    return (
        <div className="flex gap-6 pt-6">
            <div className="hidden xl:block w-[20%]">
                <Feed size="sm" />
            </div>
            <div className="w-full lg:w-[70%] xl:w-[50%] ">
                <div className="mx-4 my-2 sm:m-0 flex flex-col pt-6">
                    <Feed size="lg" />
                </div>
            </div>
            <div className="hidden lg:block w-[30%]">
                <Feed size="md" />
            </div>
        </div>
    );
}
export default Explore;