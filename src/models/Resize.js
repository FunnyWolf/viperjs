import { useState } from "react";
import { useLocalStorageState } from "ahooks";
import { Upheight } from "@/utils/utils";

export default function Resize() {
  const [resizeUpHeight, setResizeUpHeight] = useLocalStorageState("resizeUpHeight", "32vh");
  const [resizeDownHeight, setResizeDownHeight] = useLocalStorageState("resizeDownHeight", `100vh - 44px - ${resizeUpHeight}`);
  return {
    resizeUpHeight,
    setResizeUpHeight,
    resizeDownHeight,
    setResizeDownHeight,
  };
}
