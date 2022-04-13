import { format } from "date-fns";

interface Props {
  schedule: {
    from: string;
    to: string;
  };
}

function ScheduleItem({ schedule }: Props) {
  return (
    <div>
      {format(new Date(schedule.from), "yyyy-MM-dd HH:mm")}
      {" -- "}
      {format(new Date(schedule.to), "yyyy-MM-dd HH:mm")}
    </div>
  );
}

export default ScheduleItem;
