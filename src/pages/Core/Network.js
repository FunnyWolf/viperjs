import React, { memo } from "react";
import { useModel } from "umi";
import Graphin, { Behaviors, Utils } from "@antv/graphin";
import "./iconfont.css";
import fonts from "./iconfont.json";
import { formatText } from "@/utils/locales";
import { useLocalStorageState } from "ahooks";
import { DocIcon } from "@/pages/Core/Common";
import { cssCalc, Downheight } from "@/utils/utils";


const { ActivateRelations, FitView } = Behaviors;
const iconLoader = () => {
  return {
    fontFamily: "iconfont",
    glyphs: fonts.glyphs
  };
};
const { fontFamily } = iconLoader();

const icons = Graphin.registerFontFamily(iconLoader);

const Network = () => {
  console.log("Network");

  const { networkData } = useModel("HostAndSessionModel", model => ({
    networkData: model.networkData
  }));
  const {
    resizeDownHeight,
  } = useModel("Resize", model => ({
    resizeDownHeight: model.resizeDownHeight,
  }));
  const [onlyShowSession, setOnlyShowSession] = useLocalStorageState("only-show-session", false);
  const ranksepFunc = node => {
    const { id, data } = node;
    if (data.type === "session") {
      return 75;
    } else {
      return 100;
    }
  };

  const formatData = data => {

    data.nodes = data.nodes.filter(node => {
      if (onlyShowSession && node.data.type === "host" && node.data.sessionnum === undefined) {
        return false;
      }
      return true;
    });

    data.nodes.forEach(node => {
      const { id, data } = node;
      // viper节点
      if (data.type === "viper") {
        node.style = {
          keyshape: {
            size: 80,
            stroke: "#791a1f",
            fill: "#791a1f",
            fillOpacity: 0.2
          },
          icon: {
            type: "font",
            fontFamily: fontFamily,
            value: icons["v"],
            fill: "#e84749",
            size: 40
          }
        };
      } else if (data.type === "host") {
        node.style = {
          label: {
            fill: "#e8b339",
            value: node.id,
            fontSize: 14,
            offset: [0, 12]
          },
          keyshape: {
            size: 48,
            stroke: "#7c5914",
            fill: "#7c5914",
            fillOpacity: 0.2
          },
          icon: {
            type: "font",
            fontFamily: fontFamily,
            value: icons["电脑"],
            fill: "#e8b339",
            size: 30
          }
        };
        // host节点
      } else if (data.type === "session") {
        // session节点
        const { platform } = data;
        if (platform === "windows") {
          node.style = {
            label: {
              value: node.id,
              fill: "#ab7ae0",
              fontSize: 14,
              offset: [0, 12]
            },
            keyshape: {
              size: 60,
              stroke: "#642ab5",
              fill: "#642ab5",
              fillOpacity: 0.2
            },
            icon: {
              type: "font",
              fontFamily: fontFamily,
              value: icons["windows"],
              fill: "#2b4acb",
              size: 40
            }
            // badges: [
            //   {
            //     position: 'RT',
            //     type: 'text',
            //     value: sessionnum,
            //     size: [20, 20],
            //     color: '#6abe39',
            //     fill: '#306317',
            //   },
            // ],
          };
        } else {
          node.style = {
            label: {
              value: node.id,
              fill: "#ab7ae0",
              fontSize: 14,
              offset: [0, 12]
            },
            keyshape: {
              size: 60,
              stroke: "#642ab5",
              fill: "#642ab5",
              fillOpacity: 0.2
            },
            icon: {
              type: "font",
              fontFamily: fontFamily,
              value: icons["linux"],
              fill: "#d89614",
              size: 40
            }
          };
        }
      }
    });

    data.edges.forEach(edge => {
      const { data } = edge;
      const { type } = data;
      if (type === "session") {
        const { payload, alive } = data;
        edge.style = {
          label: {
            value: payload,
            fill: "#33bcb7",
            fontSize: 14
          },
          keyshape: {
            stroke: "#138585",
            lineWidth: 4
          },
          animate: {
            type: "circle-running",
            color: "#33bcb7",
            repeat: true,
            duration: 4000
          }
        };
      } else if (type === "route") {
        const { sid } = data;
        edge.style = {
          label: {
            value: ` ${formatText("app.network.msfroute")} `,
            fill: "#3c9ae8",
            fontSize: 14
          },
          keyshape: {
            stroke: "#164c7e",
            lineWidth: 3
          }
        };
      } else if (type === "scan") {
        const { method } = data;
        edge.style = {
          label: {
            value: ` ${formatText("app.network.NetScan")} ${method}`,
            fill: "#6abe39",
            fontSize: 14
          },
          keyshape: {
            stroke: "#3c8618",
            lineWidth: 2,
            lineDash: [8, 8]
          }
        };
      } else if (type === "online") {
        const { payload } = data;
        edge.style = {
          label: {
            value: payload,
            fill: "#e0529c",
            fontSize: 14
          },
          keyshape: {
            stroke: "#75204f",
            lineDash: [8, 8],
            lineWidth: 2
          }
        };

      } else if (type === "comm") {
        const { payload, sessionid } = data;
        edge.style = {
          label: {
            value: ` ${formatText("app.network.Comm")} ${sessionid}\n${payload}`,
            fill: "#e8b339",
            fontSize: 14
          },
          keyshape: {
            stroke: "#7c5914",
            lineWidth: 3
          },
          animate: {
            type: "circle-running",
            color: "#e8b339",
            repeat: true,
            duration: 4000
          }
        };
      }
    });

    data.edges = Utils.processEdges(data.edges, { poly: 100, loop: 10 });
    return data;
  };
  let data = formatData(networkData);

  return (
    <div
      style={{
        marginTop: -16,
        height: cssCalc(`${resizeDownHeight}`),
      }}
    >
      <DocIcon url="https://www.yuque.com/vipersec/help/eoign5" />
      <Graphin
        fitView={true}
        data={data}
        theme={{ mode: "dark" }}
        layout={{
          type: "dagre",
          rankdir: "RL",
          align: "DR",
          ranksepFunc: ranksepFunc
        }}
      >
        <FitView />
        <ActivateRelations />
      </Graphin>
    </div>
  );
};


const NetworkWindow = () => {
  console.log("Network");
  const { networkData } = useModel("HostAndSessionModel", model => ({
    networkData: model.networkData
  }));

  const ranksepFunc = node => {
    const { id, data } = node;
    if (data.type === "session") {
      return 75;
    } else {
      return 100;
    }
  };

  const formatData = data => {
    data.nodes.forEach(node => {
      const { id, data } = node;
      // viper节点
      if (data.type === "viper") {
        node.style = {
          keyshape: {
            size: 80,
            stroke: "#791a1f",
            fill: "#791a1f",
            fillOpacity: 0.2
          },
          icon: {
            type: "font",
            fontFamily: fontFamily,
            value: icons["v"],
            fill: "#e84749",
            size: 40
          }
        };
      } else if (data.type === "host") {
        // host节点
        node.style = {
          label: {
            fill: "#e8b339",
            value: node.id,
            fontSize: 14,
            offset: [0, 12]
          },
          keyshape: {
            size: 48,
            stroke: "#7c5914",
            fill: "#7c5914",
            fillOpacity: 0.2
          },
          icon: {
            type: "font",
            fontFamily: fontFamily,
            value: icons["电脑"],
            fill: "#e8b339",
            size: 30
          }
        };
      } else if (data.type === "session") {
        // session节点
        const { platform } = data;
        if (platform === "windows") {
          node.style = {
            label: {
              value: node.id,
              fill: "#ab7ae0",
              fontSize: 14,
              offset: [0, 12]
            },
            keyshape: {
              size: 60,
              stroke: "#642ab5",
              fill: "#642ab5",
              fillOpacity: 0.2
            },
            icon: {
              type: "font",
              fontFamily: fontFamily,
              value: icons["windows"],
              fill: "#2b4acb",
              size: 40
            }
            // badges: [
            //   {
            //     position: 'RT',
            //     type: 'text',
            //     value: sessionnum,
            //     size: [20, 20],
            //     color: '#6abe39',
            //     fill: '#306317',
            //   },
            // ],
          };
        } else {
          node.style = {
            label: {
              value: node.id,
              fill: "#ab7ae0",
              fontSize: 14,
              offset: [0, 12]
            },
            keyshape: {
              size: 60,
              stroke: "#642ab5",
              fill: "#642ab5",
              fillOpacity: 0.2
            },
            icon: {
              type: "font",
              fontFamily: fontFamily,
              value: icons["linux"],
              fill: "#d89614",
              size: 40
            }
          };
        }
      }
    });

    data.edges.forEach(edge => {
      const { data } = edge;
      const { type } = data;
      if (type === "session") {
        const { payload, alive } = data;
        edge.style = {
          label: {
            value: payload,
            fill: "#33bcb7",
            fontSize: 14
          },
          keyshape: {
            stroke: "#138585",
            lineWidth: 4
          },
          animate: {
            type: "circle-running",
            color: "#33bcb7",
            repeat: true,
            duration: 4000
          }
        };
      } else if (type === "route") {
        const { sid } = data;
        edge.style = {
          label: {
            value: ` ${formatText("app.network.msfroute")} `,
            fill: "#3c9ae8",
            fontSize: 14
          },
          keyshape: {
            stroke: "#164c7e",
            lineWidth: 3
          }
        };
      } else if (type === "scan") {
        const { method } = data;
        edge.style = {
          label: {
            value: ` ${formatText("app.network.NetScan")} ${method}`,
            fill: "#f3ea62",
            fontSize: 14
          },
          keyshape: {
            stroke: "#aa9514",
            lineWidth: 2,
            lineDash: [8, 8]
          }
        };
      } else if (type === "online") {
        const { payload } = data;
        edge.style = {
          label: {
            value: payload,
            fill: "#e0529c",
            fontSize: 14
          },
          keyshape: {
            stroke: "#75204f",
            lineDash: [8, 8],
            lineWidth: 2
          }
        };
      } else if (type === "comm") {
        const { payload, sessionid } = data;
        edge.style = {
          label: {
            value: ` ${formatText("app.network.Comm")} ${sessionid}\n${payload}`,
            fill: "#e8b339",
            fontSize: 14
          },
          keyshape: {
            stroke: "#7c5914",
            lineWidth: 3
          },
          animate: {
            type: "circle-running",
            color: "#e8b339",
            repeat: true,
            duration: 4000
          }
        };
      }
    });

    data.edges = Utils.processEdges(data.edges, { poly: 100, loop: 10 });
    return data;
  };
  let data = formatData(networkData);

  return (
    <Graphin
      height={window.innerHeight / 10 * 8}
      width={window.innerWidth / 10 * 8}
      data={data}
      theme={{ mode: "dark" }}
      fitView={true}
      layout={{
        type: "dagre",
        rankdir: "RL",
        align: "DR",
        ranksepFunc: ranksepFunc
      }}
    >
      <FitView />
      <ActivateRelations />
    </Graphin>
  );
};

export const NetworkMemo = memo(Network);
export const NetworkWindowMemo = memo(NetworkWindow);
