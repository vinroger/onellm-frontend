/* eslint-disable react/no-array-index-key */
import { Card } from "@/components/ui/card";
import { useProjectContext } from "@/utils/contexts/useProject";
import useAsync from "@/utils/hooks/useAsync";
import axios from "axios";
import React, { useEffect } from "react";

import {
  add,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  startOfMonth,
  startOfYear,
  sub,
} from "date-fns";
import {
  AreaChart,
  BarChart,
  DateRangePicker,
  DateRangePickerItem,
  LineChart,
} from "@tremor/react";
import NonIdealState from "@/components/NonIdealState";
import { MousePointerClick } from "lucide-react";

type DateSelectOption = {
  value: string;
  text: string;
  from: Date;
  to: Date;
};

const dateSelectOptions = [
  {
    value: "tdy",
    text: "Today",
    from: startOfDay(new Date()),
    to: endOfDay(new Date()),
  },
  {
    value: "3d",
    text: "Last 3 days",
    from: sub(new Date(), { days: 3 }),
    to: endOfDay(new Date()),
  },
  {
    value: "w",
    text: "Last 7 days",
    from: sub(new Date(), { days: 7 }),
    to: endOfDay(new Date()),
  },
  {
    value: "mtd",
    text: "This month",
    from: startOfMonth(new Date()),
    to: endOfDay(new Date()),
  },
  {
    value: "lm",
    text: "Last month",
    from: sub(startOfMonth(new Date()), { months: 1 }),
    to: startOfMonth(new Date()),
  },
  {
    value: "y",
    text: "This year",
    from: startOfYear(new Date()),
    to: endOfDay(new Date()),
  },
];

type RequestData = {
  date: string;
  id: string;
};

type ChartProps = {
  data: RequestData[];
  from?: Date;
  to?: Date;
};

const processChartData = (data: RequestData[], from: Date, to: Date) => {
  const filteredData = data.filter((d) => {
    const date = parseISO(d.date);
    return date >= from && date <= to;
  });

  const groupedByDate: Record<string, number> = {};

  filteredData.forEach((d) => {
    const date = format(parseISO(d.date), "yyyy-MM-dd");
    if (groupedByDate[date]) {
      // eslint-disable-next-line no-plusplus
      groupedByDate[date]++;
    } else {
      groupedByDate[date] = 1;
    }
  });

  return Object.entries(groupedByDate).map(([date, count]) => ({
    date: format(parseISO(date), "MMMM d, yyyy"),
    Requests: count,
  }));
};

const RequestsOverTimeChart: React.FC<ChartProps> = ({ data, from, to }) => {
  if (!from || !to) {
    return (
      <NonIdealState
        icon={<MousePointerClick />}
        title="No date range selected"
        description="To continue, select a date range."
      />
    );
  }
  const chartData = processChartData(data, from, to);

  return (
    <div className="text-sm">
      <BarChart
        data={chartData}
        index="date"
        categories={["Requests"]}
        colors={["blue-400"]}
        valueFormatter={(value) => value.toString()}
        className="mt-6 h-72"
      />
    </div>
  );
};

function RequestChartComponent({ className }: { className?: string }) {
  const { projectId } = useProjectContext();

  const [selectedDateOption, setSelectedDateOption] = React.useState<
    | DateSelectOption
    | {
        selectValue?: string;
        from?: Date;
        to?: Date;
      }
  >();

  const { execute, value, status } = useAsync(async () => {
    const res = await axios.get("/api/v1/logs", {
      params: {
        projectId,
      },
    });
    return res.data.logs;
  });

  useEffect(() => {
    execute();
  }, [execute]);

  const cleanedData = value?.map((log: any) => ({
    date: log.created_at,
    id: log.id,
  }));

  return (
    <Card className={className}>
      <p className="font-semibold mb-2">Requests</p>
      <DateRangePicker
        value={selectedDateOption}
        onValueChange={(e) => {
          setSelectedDateOption(e);
        }}
        selectPlaceholder="Select"
        className="text-sm"
      >
        {dateSelectOptions.map((option, index) => (
          <DateRangePickerItem key={index} {...option}>
            {option.text}
          </DateRangePickerItem>
        ))}
      </DateRangePicker>
      {cleanedData && (
        <RequestsOverTimeChart
          data={cleanedData}
          from={selectedDateOption?.from}
          to={selectedDateOption?.to}
        />
      )}
    </Card>
  );
}

export default RequestChartComponent;
