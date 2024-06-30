import { useLocalStorageState } from "ahooks";

export default function Resize () {
  const [resizeUpHeight, setResizeUpHeight] = useLocalStorageState("resizeUpHeight", "32vh");
  const [resizeDownHeight, setResizeDownHeight] = useLocalStorageState("resizeDownHeight", `100vh - 38px - ${resizeUpHeight}`);
  return {
    resizeUpHeight,
    setResizeUpHeight,
    resizeDownHeight,
    setResizeDownHeight,
  };
}
