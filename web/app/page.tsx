import ToolAccessGate from "../components/ToolAccessGate";
import CalculatorWorkspace from "../components/CalculatorWorkspace";

export default function Home() {
  return <ToolAccessGate><CalculatorWorkspace /></ToolAccessGate>;
}
