import { BarChart } from '@mui/x-charts/BarChart';

type BarChartProps = {
  id: string;
  dataAxis: string[];
  data: number[];
};

export default function BarChartComponent({
  id,
  dataAxis,
  data,
}: BarChartProps) {
  return (
    <BarChart
      xAxis={[
        {
          id,
          data: dataAxis,
          height: 8,
        },
      ]}
      series={[
        {
          data,
        },
      ]}
      height={300}
    />
  );
}
