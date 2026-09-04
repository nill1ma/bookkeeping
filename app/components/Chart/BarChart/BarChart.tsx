import { BarChart } from '@mui/x-charts/BarChart';

type BarChartProps = {
  id: string;
  dataAxis: string[];
  data: number[];
  className?: string;
};

export default function BarChartComponent({
  id,
  dataAxis,
  data,
  className,
}: BarChartProps) {
  return (
    <BarChart
      xAxis={[
        {
          id,
          data: dataAxis,
          height: 8,
          colorMap: {
            type: 'continuous',
            color: ['white', 'green'],
          },
        },
      ]}
      series={[
        {
          data,
        },
      ]}
      height={300}
      className={`${className}`}
    />
  );
}
