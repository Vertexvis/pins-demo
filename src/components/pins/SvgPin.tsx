import { VertexViewerDomElement } from "@vertexvis/viewer-react";
import React from "react";
import { Line } from "react-chartjs-2";

import SmoothRandom from "../../lib/smooth-random";
import styles from "./SvgPin.module.css";

type PinProps = {
  readonly text: string;
  readonly position: string;
  readonly onClick?: (name: string) => void;
};

function getColor(value: number) {
  //value from 0 to 1
  const hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

export function SvgPin({ text, position }: PinProps): JSX.Element {
  const [data, setData] = React.useState({
    labels: new Array<string>(),
    datasets: [
      {
        data: new Array<number>(),
        fill: false,
        backgroundColor: "rgba(0,0,0,.2)",
        borderColor: "rgba(0,0,0,.2)",
        pointBackgroundColor: new Array<string>(),
      },
    ],
  });

  const [val, setVal] = React.useState(0);

  React.useEffect(() => {
    const sm = SmoothRandom(2);
    const i = setInterval(() => {
      const next = sm();
      setVal(next);
      const color = getColor(1 - next);

      const newLables =
        data.labels.length === 100
          ? data.labels.slice(1).concat(new Date().toLocaleTimeString())
          : [...data.labels, new Date().toLocaleTimeString()];

      const newData =
        data.labels.length === 100
          ? data.datasets[0].data.slice(1).concat(next)
          : [...data.datasets[0].data, next];

      const newPointBackgroundColors =
        data.labels.length === 100
          ? data.datasets[0].pointBackgroundColor.slice(1).concat(color)
          : [...data.datasets[0].pointBackgroundColor, color];

      setData({
        labels: newLables,
        datasets: [
          {
            data: newData,
            fill: false,
            backgroundColor: "rgba(0,0,0,.2)",
            borderColor: "rgba(0,0,0,.2)",
            pointBackgroundColor: newPointBackgroundColors,
          },
        ],
      });
    }, 3000);

    return () => clearInterval(i);
  }, [setVal, data]);

  const options = {
    elements: {
      line: {
        tension: 1,
        borderWidth: 1,
      },
      point: {
        radius: 2,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        ticks: {
          display: true,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          display: false,
          callback: (data: any) => data.toFixed(3),
        },
      },
    },
  };

  return (
    <VertexViewerDomElement positionJson={position} className={styles.pin}>
      <div>
        <p className={styles.value} style={{ backgroundColor: getColor(1 - val) }}>{val.toFixed(3)}</p>
        <div className={styles.down} style={{ borderTopColor: getColor(1 - val)}}></div>
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill={getColor(1 - val)}
          className={styles.pinSvg}
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg> */}
        <div className={styles.info}>
          <h4 className={styles.title}>
            {text}
          </h4>
          <div className={styles.content}>
            <Line data={data} options={options} />
          </div>
        </div>
      </div>
    </VertexViewerDomElement>
  );
}
