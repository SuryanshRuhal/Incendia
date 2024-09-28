import Advertisementlist from "./advertisementlist";
import Birthdays from "./Birthdays";
import Followrequest from "./Followrequest";
import Suggestions from "./suggestions";

const Rightmenu = () => {
    return (
        <div className="flex flex-col gap-6">
            <Followrequest />
            <Birthdays />
            <Suggestions />
            <Advertisementlist limit={6} />
        </div>
    );
}
export default Rightmenu;