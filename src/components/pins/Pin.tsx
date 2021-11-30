import "chart.js/auto";

import { VertexViewerDomElement } from "@vertexvis/viewer-react";
import React from "react";
import { Chart } from "react-chartjs-2";

import SmoothRandom from "../../lib/smooth-random";
import styles from "./Pin.module.css";

type PinProps = {
  readonly text: string;
  readonly position: string;
  readonly onClick?: (name: string) => void;
  readonly startingValue?: number;
  readonly smoothingFactor?: number;
};

function getColor(value: number) {
  // Value from 0 to 1
  const hue = ((1 - value) * 120).toString(10);
  return ["hsl(", hue, ",100%,50%)"].join("");
}

export function Pin({
  text,
  position,
  startingValue,
  smoothingFactor,
}: PinProps): JSX.Element {
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
    const sm = SmoothRandom(smoothingFactor || 7, startingValue);
    const i = setInterval(() => {
      const next = sm() * 100;
      setVal(next);

      const newLabels =
        data.labels.length === 30
          ? data.labels.slice(1).concat(new Date().toLocaleTimeString())
          : [...data.labels, new Date().toLocaleTimeString()];

      const newData =
        data.labels.length === 30
          ? data.datasets[0].data.slice(1).concat(next)
          : [...data.datasets[0].data, next];

      const c = getColor(1 - next / 100);
      const newPointBackgroundColors =
        data.labels.length === 30
          ? data.datasets[0].pointBackgroundColor.slice(1).concat(c)
          : [...data.datasets[0].pointBackgroundColor, c];

      setData({
        labels: newLabels,
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
    }, 1000);

    return () => clearInterval(i);
  }, [setVal, data, startingValue, smoothingFactor]);

  const color = getColor(1 - val / 100);
  return (
    <VertexViewerDomElement positionJson={position} className={styles.pin}>
      <div>
        <p className={styles.value} style={{ backgroundColor: color }}>
          {val.toFixed(3)}
        </p>
        <div className={styles.down} style={{ borderTopColor: color }}></div>
        <div className={styles.info}>
          <h4 className={styles.title}>{text}</h4>
          <div className={styles.content}>
            <Chart
              type="line"
              data={data}
              options={{
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
                      callback: (d: string | number) =>
                        typeof d === "string" ? d : d.toFixed(3),
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </VertexViewerDomElement>
  );
}
